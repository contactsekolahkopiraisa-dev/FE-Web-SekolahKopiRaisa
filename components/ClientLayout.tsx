"use client";

import { usePathname } from "next/navigation";
import { Building, CalendarCheck, Coffee, House, Settings } from "lucide-react";
import Navbar from "./main/Navbar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/reset-password";
  const isAdminPage = pathname.startsWith("/admin");

  const navbarItems = [
    { title: "Beranda", link: "/", icon: <House size={20} /> },
    { title: "Tentang", link: "/about", icon: <Building size={20} /> },
    { title: "Produk", link: "/product", icon: <Coffee size={20} /> },
    { title: "Kegiatan", link: "/activity", icon: <CalendarCheck size={20} /> },
    { title: "Layanan", link: "/layanan", icon: <Settings size={20} /> },
  ];

  return (
    <>
      {!isAuthPage && !isAdminPage && <Navbar navbarItems={navbarItems} />}
      <main>{children}</main>
    </>
  );
}