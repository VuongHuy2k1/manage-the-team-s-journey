/** Đổi mã lỗi Firebase thành câu dễ hiểu */
export function authErrorMessage(error: unknown): string | null {
  const code = (error as { code?: string })?.code ?? '';
  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return null;
  if (code === 'auth/popup-blocked') return 'Trình duyệt chặn cửa sổ đăng nhập. Cho phép cửa sổ bật lên rồi thử lại.';
  if (code === 'auth/unauthorized-domain') return 'Tên miền này chưa được thêm vào Firebase (Authentication → Settings → Authorized domains).';
  if (code === 'auth/operation-not-allowed') return 'Firebase chưa bật đăng nhập Google (Authentication → Sign-in method).';
  if (code === 'auth/network-request-failed') return 'Mất kết nối mạng, thử lại khi có mạng.';
  if (code === 'auth/too-many-requests') return 'Thử quá nhiều lần, đợi một lúc rồi thử lại.';
  if (code === 'auth/invalid-api-key' || code === 'auth/api-key-not-valid.-please-pass-a-valid-api-key.') {
    return 'Cấu hình Firebase sai (apiKey). Kiểm tra lại file .env.local.';
  }
  if (code === 'app/timeout') {
    return 'Server Firebase không phản hồi. Tắt trình chặn quảng cáo / thử cửa sổ ẩn danh, kiểm tra mạng rồi thử lại.';
  }
  if (code.includes('permission-denied')) return 'Bạn không có quyền làm việc này.';
  if (code === 'app/not-configured') return 'Chưa cấu hình Firebase.';
  return 'Có lỗi xảy ra, thử lại sau.';
}

export function isPermissionDenied(error: unknown): boolean {
  return ((error as { code?: string })?.code ?? '').includes('permission-denied');
}
