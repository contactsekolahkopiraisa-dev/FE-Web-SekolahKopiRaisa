import type { ReactNode } from "react";
import Sidebar from "../components/Sidebar";
import {
  LayoutDashboard,
  CalendarCheck,
  Building,
  FileText,
  Package,
  Handshake,
  NotepadText,
} from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, text: "Dashboard", href: "/admin" },
    {
      icon: <CalendarCheck size={20} />,
      text: "Kegiatan",
      href: "/admin/activity",
    },
    {
      icon: <Package size={20} />,
      text: "Produk",
      href: "/admin/product",
    },
    {
      icon: <Handshake size={20} />,
      text: "Mitra",
      href: "/admin/partner",
    },
    {
      icon: <NotepadText size={20} />,
      text: "Order",
      href: "/admin/order",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar items={sidebarItems} />
      <main className="flex-1 h-screen overflow-y-auto p-4">{children}</main>
    </div>
  );
}
