import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/app/components/ui/utils";

export const metadata: Metadata = {
  title: { default: "Moe Tsuchiya | Portfolio", template: "%s | Moe Tsuchiya" },
  description: "土屋萌のポートフォリオ。これまでの制作物、使用技術、お問い合わせをご紹介します。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased"
        )}
      >
        {children}
      </body>
    </html>
  );
}
