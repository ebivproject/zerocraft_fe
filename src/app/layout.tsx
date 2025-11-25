import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthProvider";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Craft - 사업계획서 작성 서비스",
  description: "AI 기반 사업계획서 작성 도우미",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
