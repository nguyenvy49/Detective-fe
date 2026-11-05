import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Điều Tra Viên — Hiện trường 01",
  description: "Trải nghiệm điều tra hiện trường góc nhìn thứ nhất",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
