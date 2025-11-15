import type { ReactNode } from "react";
import Sidebar from "../../components/main/Sidebar";
import {
  LayoutDashboard,
  Wallet,
  Package,
  NotepadText,
} from "lucide-react";

export default function UmkmLayout({ children }: { children: ReactNode }) {
  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, text: "Dashboard", href: "/umkm" },
    {
      icon: <Package size={20} />,
      text: "Marketplace",
      href: "/umkm/marketplace",
    },
    {
      icon: <Wallet size={20} />,
      text: "Laporan Penjualan",
      href: "/umkm/laporan-penjualan",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar items={sidebarItems} />
      <main className="flex-1 h-screen overflow-y-auto p-4">{children}</main>
    </div>
  );
}
