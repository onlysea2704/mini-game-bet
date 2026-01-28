import { Roboto } from "next/font/google";
import "./globals.css";

// Khởi tạo font Roboto
const roboto = Roboto({
  weight: ['400', '500', '700', '900'], // Các độ đậm nhạt khác nhau
  subsets: ["latin", "vietnamese"],      // Bắt buộc phải có vietnamese
  display: 'swap',
});

export const metadata = {
  title: "Đấu Trường Tửu Lượng",
  description: "Cược vui công ty",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      {/* Áp dụng font vào toàn bộ body */}
      <body className={roboto.className}>
        {children}
      </body>
    </html>
  );
}