/** Trình duyệt nhúng trong Zalo, Messenger, Facebook, Instagram… (Google chặn đăng nhập ở đây) */
export function isInAppBrowser(userAgent: string): boolean {
  return /Zalo|FBAN|FBAV|FB_IAB|Messenger|Instagram|Line\/|TikTok|musical_ly|; wv\)/i.test(userAgent);
}
