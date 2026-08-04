import type { Metadata, Viewport } from "next";
import "./globals.css";
import StoreShell from "../components/StoreShell";

export const metadata: Metadata = {
  title: "มธุรส | ผลไม้คัดพิเศษส่งตรงจากสวน",
  description:
    "มธุรสคัดผลไม้พรีเมียมจากสวน วัดความหวานทุกล็อต และจัดส่งถึงบ้าน",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#17201a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body>
        <StoreShell>{children}</StoreShell>
      </body>
    </html>
  );
}
