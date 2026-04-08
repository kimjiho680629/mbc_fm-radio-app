import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MBC 표준FM | 호주에서 듣는 한국 라디오",
  description: "호주에서 MBC 표준FM을 끊김 없이 즐기세요",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="animated-bg min-h-screen">
        {children}
      </body>
    </html>
  );
}
