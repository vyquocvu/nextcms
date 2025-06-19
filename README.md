# NextCMS

NextCMS là một hệ thống quản lý nội dung (CMS) đơn giản được xây dựng bằng **Next.js** và **Prisma**. Dự án mô phỏng các tính năng cơ bản của Strapi để giúp bạn làm quen với cách xây dựng CMS bằng Next.js (App Router) và cơ sở dữ liệu qua Prisma.

## Cài đặt

1. Cài đặt các phụ thuộc trong thư mục `cms`:
   ```bash
   cd cms
   npm install
   ```
2. Tạo file `.env` trong thư mục `cms` và khai báo đường dẫn cơ sở dữ liệu:
   ```bash
   DATABASE_URL="file:./dev.db"
   ```
3. Sinh Prisma Client và khởi tạo cơ sở dữ liệu:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

## Chạy ở chế độ phát triển

Sau khi cài đặt, khởi chạy máy chủ Next.js:
```bash
npm run dev
```
Ứng dụng sẽ chạy tại `http://localhost:3000`. Giao diện quản trị nằm ở đường dẫn `/dashboard` với các mục **Posts**, **Profile** và **Settings**.

## Cấu trúc dự án

- `cms/prisma/schema.prisma` – Định nghĩa các model: `User`, `Role`, `Permission`, `Resource`, `Post`, `Category`, `Media`.
- `cms/src/app` – Mã nguồn Next.js và các route API.
- `cms/data/posts.json` – Nơi lưu trữ dữ liệu bài viết mẫu.

API đơn giản cho bài viết có sẵn tại `/api/posts`, cho phép tạo và lấy danh sách bài viết.

## Giấy phép

Dự án sử dụng giấy phép MIT. Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

