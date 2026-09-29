# Bizen UI Migration

## Nguyên tắc
- Giữ nguyên logic nghiệp vụ của chương trình gốc.
- Không thay đổi API/service, state, xử lý dữ liệu, route nghiệp vụ hoặc các page logic.
- Không chuyển giao diện Login/Auth từ project giao diện mới.
- Thay lớp UI chung sang phong cách Bizen hiện đại: nền sáng, teal/aqua, sidebar gọn, card bo góc, shadow nhẹ, responsive.
- Tailwind CSS dùng cho shell/layout/utility; Chakra UI tiếp tục dùng cho các component nghiệp vụ hiện có.

## Các file thay đổi
- `src/components/ModernLayout.js` — shell/sidebar/header responsive mới.
- `src/components/Layout.js` — dùng shell mới, giữ Outlet của React Router.
- `src/pages/Home.js` — bỏ LeftPanel cũ khỏi vùng nội dung; giữ nguyên toàn bộ logic chọn page theo pathname.
- `src/App.js` — chỉ đổi theme/font/màu Chakra, không đổi routing/API.
- `src/index.css` — design system Bizen + Tailwind utilities + style override cho Chakra/legacy controls.
- `tailwind.config.js` — cấu hình Tailwind, tắt preflight để không xung đột Chakra.
- `postcss.config.js` — cấu hình PostCSS/Tailwind.
- `package.json` — thêm `tailwindcss`, `postcss`, `autoprefixer`.

## Cài dependency
Sau khi copy project, chạy:

```bash
npm install
npm start
```

`package-lock.json` của project gốc được giữ nguyên; dùng `npm install` để npm đồng bộ thêm các dependency Tailwind mới.
