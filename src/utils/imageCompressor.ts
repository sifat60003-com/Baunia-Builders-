/**
 * Image compression & storage utility
 * Resizes large photos to optimal dimensions (max 800x800), compresses to lightweight WebP/JPEG,
 * and handles safe Supabase Storage upload with automatic fallback to optimized WebP data URL.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Compresses an image file or base64 string to a lightweight WebP/JPEG data URL.
 */
export async function compressImage(
  fileOrBase64: File | string,
  maxWidth = 800,
  maxHeight = 800,
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

        // Calculate proportional dimensions
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

        // Try WebP first, fallback to JPEG
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
 * Uploads an optimized photo (compressed WebP, max 800px).
 * Tries Supabase Storage bucket 'photos' if available;
 * If Supabase storage is unavailable, fails, or bucket doesn't exist, gracefully falls back to the compressed data URL.
 */
export async function uploadOptimizedPhoto(
  file: File,
  folder: 'members' | 'nominees' | 'avatars' | 'general' = 'members'
): Promise<string> {
  // Step 1: Compress & resize in browser
  const compressedDataUrl = await compressImage(file, 800, 800, 0.75);

  // Step 2: Attempt Supabase Storage upload if configured
  if (isSupabaseConfigured()) {
    try {
      const blob = dataURLtoBlob(compressedDataUrl);
      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
      const fileName = `${folder}/${Date.now()}_${cleanName}.webp`;

      const { data, error } = await supabase.storage
        .from('photos')
        .upload(fileName, blob, {
          contentType: 'image/webp',
          upsert: true,
          cacheControl: '31536000', // 1 year browser cache
        });

      if (!error && data?.path) {
        const { data: urlData } = supabase.storage.from('photos').getPublicUrl(fileName);
        if (urlData?.publicUrl) {
          return urlData.publicUrl;
        }
      }
    } catch (err) {
      console.warn('Supabase storage upload skipped/failed, using compressed data URL:', err);
    }
  }

  // Graceful fallback to compressed WebP data URL
  return compressedDataUrl;
}

/**
 * Removes an old photo from Supabase Storage if it was hosted there.
 */
export async function deletePhotoFromStorage(photoUrl?: string): Promise<void> {
  if (!photoUrl || !photoUrl.includes('/storage/v1/object/public/photos/')) {
    return;
  }
  try {
    const parts = photoUrl.split('/public/photos/');
    const filePath = parts[1];
    if (filePath) {
      await supabase.storage.from('photos').remove([decodeURIComponent(filePath)]);
    }
  } catch (err) {
    console.warn('Failed to delete old photo from Supabase storage:', err);
  }
}

