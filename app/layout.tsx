import ClientLayout from "./components/ClientLayout";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Sekolah Kopi Raisa',
  description: 'Sistem informasi untuk mengelola kegiatan dan produk',
  icons: {
    icon: '/assets/logo.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}