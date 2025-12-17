"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SubNavLayananAdmin() {
  const pathname = usePathname();

  // Hide subnavbar on Monitoring page
  if (pathname?.startsWith("/admin/layanan/monitoring")) {
    return null;
  }

  const tabs = [
    {
      label: "Daftar Layanan",
      href: "/admin/layanan/daftar-layanan",
    },
    {
      label: "Kegiatan Selesai",
      href: "/admin/layanan/daftar-layanan/riwayat",
    },
  ];

  return (
    <div className="border-b border-gray-200">
      <div className="container mx-auto px-4 max-w-6xl">
        <nav className="flex gap-6 text-sm">
          {tabs.map((t) => {
            const active = pathname === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`py-3 border-b-2 transition-colors ${
                  active
                    ? "border-amber-700 text-amber-800"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
