/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: { includePaths: ['./src/modules/ui-core/styles'] },
  // Cho phép cửa sổ đăng nhập Google báo kết quả về trang (bỏ cảnh báo Cross-Origin-Opener-Policy)
  async headers() {
    return [{ source: '/:path*', headers: [{ key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' }] }];
  },
};

export default nextConfig;
