# Đà Lạt 3N2Đ · Sổ tay hành trình nhóm

Tác giả: **Nhân Nguyễn**

Web app (ưu tiên điện thoại) cho cả nhóm dùng chung: lịch trình, chỉ đường, đề xuất đổi lịch qua bản nháp, nhóm trưởng duyệt, tick hoàn thành và nhập chi phí thực tế, quỹ MoMo, tài khoản Google, quản lý thành viên và chia sẻ vị trí. Dữ liệu lưu trên **Firebase (gói Spark miễn phí)** và cập nhật trực tiếp giữa các máy.

## Chạy trên máy

```bash
npm install
npm run dev        # http://localhost:3000
```

File `.env.local` chứa cấu hình Firebase (xem `.env.example`). File này không được đẩy lên git.

## Cài đặt Firebase (làm một lần)

1. **Project**: https://console.firebase.google.com → tạo project, gói Spark.
2. **Web app**: Project Overview → Add app → Web → copy `firebaseConfig` vào `.env.local`.
3. **Đăng nhập Google**: Security → Authentication → Sign-in method → Add new provider → Google → Enable → chọn support email → Save.
4. **Tên miền**: Authentication → Settings → Authorized domains → thêm tên miền khi public (ví dụ `ten-app.vercel.app`). `localhost` có sẵn.
5. **Database**: Databases & Storage → Firestore → Create database → Standard → `asia-southeast1 (Singapore)` → Production mode.
6. **Mã nhóm trưởng**: Firestore → Data → collection `secrets` → document `leader` → field `passcode` (string) = mã 6 số.
7. **Quy tắc bảo mật**: Firestore → Rules → dán nội dung file `firestore.rules` → Publish. Mỗi lần file này thay đổi phải dán lại.

## Public lên Vercel (miễn phí)

1. Đẩy code lên GitHub.
2. https://vercel.com → Add New Project → chọn repo → mục **Environment Variables** dán các dòng trong `.env.local`.
3. Deploy, rồi thêm tên miền Vercel vào Firebase Authorized domains (bước 4 ở trên).

## Vào web và phân quyền

- Màn `/vao`: chọn **Thành viên** hoặc **Nhóm trưởng** → **Tiếp tục với Google**.
- Lần đầu: tạo hồ sơ (tên hiển thị + ảnh, điền sẵn từ Google).
- Chọn Nhóm trưởng: nhập mã 6 số. Mã được **Firestore rules kiểm tra trên server** (so với `secrets/leader`), chỉ cần nhập một lần. Có thể có nhiều nhóm trưởng.
- Người đầu tiên vào với quyền nhóm trưởng sẽ tự tạo lịch trình ban đầu cho cả nhóm.
- Nhóm trưởng được: duyệt / từ chối đổi lịch, khôi phục phiên bản, xác nhận hoàn thành và nhập chi phí thực tế, sửa quỹ, đổi QR MoMo, **xoá / khôi phục thành viên** (`/thanh-vien`). Người bị xoá không vào lại được cho đến khi được khôi phục.
- Trang **Tài khoản của tôi** (`/tai-khoan`): đổi tên, ảnh đại diện, xem thành viên, đăng xuất.

Lưu ý: Google chặn đăng nhập trong trình duyệt của Zalo/Messenger. App tự nhận ra và hướng dẫn mở bằng Chrome/Safari.

## Chia sẻ vị trí (`/vi-tri`)

Bật chia sẻ → cả nhóm thấy vị trí trên bản đồ (OpenStreetMap), khoảng cách và nút chỉ đường Google Maps tới từng người. Vị trí gửi lên khi di chuyển trên 30 m hoặc mỗi 90 giây, **chỉ khi web đang mở** (trình duyệt không cho chạy nền) và chỉ trên `https` hoặc `localhost`.

## Các màn hình

| Route | Màn | Module |
|---|---|---|
| `/vao` | Chọn vai trò, đăng nhập Google, tạo hồ sơ, mã nhóm trưởng | `account` |
| `/tai-khoan` | Tài khoản của tôi | `account` |
| `/thanh-vien` | Thành viên, nhóm trưởng xoá / khôi phục | `member` |
| `/lich-trinh` | Lịch chính thức, chỉ đường, tick hoàn thành | `schedule` |
| `/ban-nhap`, `/so-sanh` | Bản nháp kéo thả, so sánh, gửi yêu cầu | `proposal` |
| `/yeu-cau`, `/lich-su` | Bình chọn, duyệt, lịch sử phiên bản | `proposal` |
| `/da-xong` | Thực tế so với dự tính | `completion` |
| `/vi-tri` | Chia sẻ vị trí, bản đồ cả nhóm | `location` |
| `/quy` | Quỹ MoMo, tổng kết, chia đầu người | `fund` |

## Cấu trúc thư mục

```
src/
├── app/                 # Route; các màn trong chuyến nằm trong (trip)/ và được bọc AuthGate
├── core/
│   ├── api/             # account.api.ts, location.api.ts (gọi Firebase)
│   ├── firebase/        # Khởi tạo Firebase, đường dẫn dữ liệu
│   ├── store/           # trip.store.ts (đồng bộ realtime), trip.actions.ts
│   ├── data/            # Lịch trình ban đầu
│   ├── hooks/ config/ utils/
└── modules/
    ├── ui-core/         # Atomic: atoms / molecules / organisms dùng chung
    ├── account/         # Đăng nhập Google, hồ sơ, tài khoản của tôi, AuthGate
    ├── member/          # Thành viên, quyền nhóm trưởng, xoá thành viên
    ├── schedule/        # Lịch chính thức, chỉ đường
    ├── proposal/        # Nháp → so sánh → yêu cầu → duyệt → lịch sử
    ├── completion/      # Hoàn thành mốc, thực tế vs dự tính
    ├── location/        # Chia sẻ vị trí, bản đồ
    └── fund/            # Quỹ MoMo, tổng chi phí
```

Mỗi module tính năng có `components/` (UI thuần), `functions/` (component có logic), `screens/`, `hooks/` (`*.hook.ts`), `utils/` (`*.utils.ts`), `<module>.type.ts`, `index.ts`. Mỗi component gồm `X.tsx`, `X.type.ts`, `X.module.scss`.

## Dữ liệu trên Firestore

```
secrets/leader                    { passcode }            # chỉ rules đọc được
trips/{TRIP_ID}                   lịch, phiên bản, yêu cầu, hoàn thành, quỹ
trips/{TRIP_ID}/members/{uid}     hồ sơ: tên, email, ảnh, vai trò, đã bị xoá
trips/{TRIP_ID}/leaders/{uid}     đánh dấu nhóm trưởng (tạo khi nhập đúng mã)
trips/{TRIP_ID}/drafts/{uid}      bản nháp riêng
trips/{TRIP_ID}/locations/{uid}   vị trí đang chia sẻ
```

Ảnh đại diện được nén (256px, JPEG) và lưu thẳng trong hồ sơ, không cần Firebase Storage (dịch vụ này yêu cầu gói trả phí).
