// app\admin\layout.tsx
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
  HandCoins,
  StoreIcon,
  Wallet,
  ChartNoAxesCombined,
  Store,
  User,
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
      icon: <StoreIcon size={20} />,
      text: "UMKM",
      href: "/admin/umkm",
    },
    {
      icon: <FileText size={20} />,
      text: "Order",
      href: "/admin/order",
    },
    {
      icon: <Wallet size={20} />,
      text: "Laporan Keuangan",
      href: "/admin/laporan-keuangan",
    },
    {
      icon: <ChartNoAxesCombined size={20} />,
      text: "Laporan Penjualan",
      subItems: [
        {
          icon: <User size={16} />,
          text: "Admin",
          href: "/admin/laporan-penjualan/admin",
        },
        {
          icon: <Store size={16} />,
          text: "UMKM",
          href: "/admin/laporan-penjualan/umkm",
        },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar items={sidebarItems} />
      <main className="flex-1 h-screen overflow-y-auto p-4">{children}</main>
    </div>
  );
}
