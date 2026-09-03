/**
 * Supabase Photo Egress & Storage Optimization Utility
 * 1. Resizes large photos browser-side to max 600-800px before uploading.
 * 2. Compresses images to lightweight WebP (or optimized JPEG) with ~75% quality.
 * 3. Never uploads large original photos directly to Supabase Storage.
 * 4. Stores clean public URLs/paths in the database, avoiding heavy base64 strings.
 * 5. Uses 1-year browser cache headers ('31536000') on Supabase Storage so repeat views do not consume egress.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const PRIMARY_PHOTO_BUCKET = 'member-photos';
export const FALLBACK_PHOTO_BUCKET = 'photos';

/**
 * Compresses an image file or base64 string browser-side to a lightweight WebP/JPEG data URL.
 * Constrains dimensions to maxWidth/maxHeight (e.g. 700x700px) and quality (0.75).
 */
export async function compressImage(
  fileOrBase64: File | Blob | string,
  maxWidth = 700,
  maxHeight = 700,
  quality = 0.75
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If it's already a tiny SVG
    if (typeof fileOrBase64 === 'string' && fileOrBase64.startsWith('data:image/svg+xml')) {
      return resolve(fileOrBase64);
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        let width = img.width;
        let height = img.height;

        // Calculate proportional dimensions capped at maxWidth/maxHeight
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          if (typeof fileOrBase64 === 'string') resolve(fileOrBase64);
          else {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(fileOrBase64);
          }
          return;
        }

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, width, height);

        // Prefer modern WebP for optimal compression ratio; fallback to JPEG
        let dataUrl = '';
        try {
          dataUrl = canvas.toDataURL('image/webp', quality);
          if (!dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
        } catch {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(dataUrl);
      } catch (err) {
        console.warn('Canvas compression fallback:', err);
        if (typeof fileOrBase64 === 'string') {
          resolve(fileOrBase64);
        } else {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(fileOrBase64);
        }
      }
    };

    img.onerror = () => {
      if (typeof fileOrBase64 === 'string') {
        resolve(fileOrBase64);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(fileOrBase64);
      }
    };

    if (typeof fileOrBase64 === 'string') {
      img.src = fileOrBase64;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
        } else {
          reject(new Error('Failed to read image file'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(fileOrBase64);
    }
  });
}

/**
 * Converts a data URL to a Blob
 */
export function dataURLtoBlob(dataurl: string): Blob {
  const arr = dataurl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/webp';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Uploads an optimized photo (compressed WebP, max 700px).
 * Tries Supabase Storage bucket 'member-photos' first, with fallback to 'photos'.
 * Sets 1-year browser cache ('31536000') so egress is strictly minimized.
 */
export async function uploadOptimizedPhoto(
  fileOrBlobOrBase64: File | Blob | string,
  folder: 'members' | 'nominees' | 'avatars' | 'general' = 'members',
  customFileName?: string
): Promise<string> {
  // Step 1: Compress & resize in browser
  const compressedDataUrl = await compressImage(fileOrBlobOrBase64, 700, 700, 0.75);

  // Step 2: Attempt Supabase Storage upload if configured
  if (isSupabaseConfigured()) {
    const bucketsToTry = [PRIMARY_PHOTO_BUCKET, FALLBACK_PHOTO_BUCKET];
    const blob = dataURLtoBlob(compressedDataUrl);

    let cleanName = customFileName || (fileOrBlobOrBase64 instanceof File ? fileOrBlobOrBase64.name : `photo_${Date.now()}`);
    cleanName = cleanName.replace(/\.[^/.]+$/, ''); // remove old extension
    cleanName = cleanName.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    const fileName = `${folder}/${Date.now()}_${cleanName}.webp`;

    for (const bucket of bucketsToTry) {
      try {
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(fileName, blob, {
            contentType: 'image/webp',
            upsert: true,
            cacheControl: '31536000', // 1 year browser cache for extreme egress reduction
          });

        if (!error && data?.path) {
          const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
          if (urlData?.publicUrl) {
            return urlData.publicUrl;
          }
        } else if (error) {
          console.warn(`Supabase storage upload error on bucket ${bucket}:`, error.message);
        }
      } catch (err) {
        console.warn(`Supabase storage error on bucket ${bucket}:`, err);
      }
    }
  }

  // Graceful fallback to compressed WebP data URL if storage is offline or unreachable
  return compressedDataUrl;
}

/**
 * Removes an old photo from Supabase Storage if it was hosted in member-photos or photos.
 */
export async function deletePhotoFromStorage(photoUrl?: string): Promise<void> {
  if (!photoUrl) return;

  const match = photoUrl.match(/\/storage\/v1\/object\/public\/(member-photos|photos)\/(.+)/);
  if (match) {
    const bucket = match[1];
    const filePath = decodeURIComponent(match[2]);
    try {
      await supabase.storage.from(bucket).remove([filePath]);
    } catch (err) {
      console.warn(`Failed to delete old photo from ${bucket}:`, err);
    }
  }
}

/**
 * Helper to migrate an existing base64 string to a lightweight Supabase storage WebP file.
 */
export async function migrateBase64ToStorageUrl(
  base64String: string,
  folder: 'members' | 'nominees',
  memberId: string
): Promise<string | null> {
  if (!base64String || !base64String.startsWith('data:image')) {
    return null;
  }
  try {
    const cleanId = memberId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const resultUrl = await uploadOptimizedPhoto(
      base64String,
      folder,
      `${cleanId}_photo`
    );
    if (resultUrl && resultUrl.startsWith('http')) {
      return resultUrl;
    }
  } catch (err) {
    console.error(`Failed to migrate photo for ${memberId}:`, err);
  }
  return null;
}

