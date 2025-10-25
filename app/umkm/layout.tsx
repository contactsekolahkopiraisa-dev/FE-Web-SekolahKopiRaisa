import type { ReactNode } from "react";
import Sidebar from "../../components/main/Sidebar";
import {
  LayoutDashboard,
  CalendarCheck,
  Building,
  FileText,
  Package,
  Handshake,
  NotepadText,
} from "lucide-react";

export default function UmkmLayout({ children }: { children: ReactNode }) {
  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, text: "Dashboard", href: "/umkm" },
    {
      icon: <CalendarCheck size={20} />,
      text: "Kegiatan",
      href: "/umkm/activity",
    },
    {
      icon: <Package size={20} />,
      text: "Produk",
      href: "/umkm/product",
    },
    {
      icon: <Handshake size={20} />,
      text: "Mitra",
      href: "/umkm/partner",
    },
    {
        icon: <Handshake size={20} />,
        text: "UMKM",
        href: "/umkm/partner",
      },
    {
      icon: <NotepadText size={20} />,
      text: "Order",
      href: "/umkm/order",
    },
    {
      icon: <Handshake size={20} />,
      text: "Laporan Keuangan",
      href: "/umkm/partner",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar items={sidebarItems} />
      <main className="flex-1 h-screen overflow-y-auto p-4">{children}</main>
    </div>
  );
}
