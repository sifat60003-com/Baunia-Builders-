/**
 * Image compression utility
 * Resizes large photos and compresses to WebP.
 */

export async function compressImage(
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.75
): Promise<Blob> {
  return new Promise((resolve, reject) => {
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
          reject(new Error('Canvas context not available'));
          return;
        }

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Canvas toBlob failed'));
          },
          'image/webp',
          quality
        );
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));

    const reader = new FileReader();
    reader.onload = (e) => (img.src = e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
