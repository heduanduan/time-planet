import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "时空星球",
  description: "连接记忆与对话的温暖星球",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="font-sans">{children}</body>
    </html>
  );
}
