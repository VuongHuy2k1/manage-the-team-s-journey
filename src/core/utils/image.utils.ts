/** Đọc ảnh, thu nhỏ về cạnh dài tối đa maxSize và nén (để lưu thẳng vào database) */
export function readImageAsDataUrl(file: File, maxSize = 600, type: 'image/png' | 'image/jpeg' = 'image/png', quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File không phải ảnh'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Không đọc được ảnh'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Không đọc được ảnh, thử ảnh khác'));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (type === 'image/jpeg' && ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL(type, quality));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

/** Ảnh đại diện: cắt vuông giữa ảnh, 256px, JPEG ~20–40KB */
export function readAvatar(file: File, size = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    readImageAsDataUrl(file, 1024, 'image/jpeg', 0.9)
      .then((src) => {
        const img = new Image();
        img.onload = () => {
          const side = Math.min(img.width, img.height);
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          canvas.getContext('2d')?.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        };
        img.onerror = () => reject(new Error('Không đọc được ảnh'));
        img.src = src;
      })
      .catch(reject);
  });
}

/** Lưu ảnh về máy: điện thoại mở bảng chia sẻ (Lưu ảnh), máy tính tải file xuống */
export async function saveImage(dataUrl: string, filename: string): Promise<'shared' | 'downloaded'> {
  const blob = await (await fetch(dataUrl)).blob();
  const file = new File([blob], filename, { type: blob.type || 'image/png' });
  const nav = navigator as Navigator & { canShare?: (data: { files: File[] }) => boolean };
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isTouch && nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file], title: filename });
      return 'shared';
    } catch {
      // người dùng huỷ bảng chia sẻ: chuyển sang tải file
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return 'downloaded';
}
