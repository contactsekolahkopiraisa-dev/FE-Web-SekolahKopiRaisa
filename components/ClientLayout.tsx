"use client";

import { usePathname } from "next/navigation";
import { Building, CalendarCheck, Coffee, House, Settings } from "lucide-react";
import Navbar from "./main/Navbar";
import { useEffect } from "react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Sync token from localStorage to cookie on app load (server-side)
  // Only sync when user tries to access protected routes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const cookieExists = document.cookie.split(';').some((item) => item.trim().startsWith('token='));
      
      // Only sync token if user has token AND accessing protected routes
      const isProtectedRoute = pathname.startsWith('/admin') || 
                               pathname.startsWith('/umkm') || 
                               pathname.startsWith('/layanan/riwayat') ||
                               pathname.startsWith('/layanan/detail-pelaksanaan') ||
                               pathname === '/cart' ||
                               pathname === '/checkout' ||
                               pathname === '/profile' ||
                               pathname.startsWith('/order');
      
      if (token && !cookieExists && isProtectedRoute) {
        console.log("⚠️ Token found in localStorage but not in cookie, calling server to set cookie...");
        
        // Call server-side API to set cookie properly
        fetch('/api/auth/set-cookie', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })
          .then(response => {
            if (response.ok) {
              console.log("✅ Cookie set via server, reloading...");
              window.location.reload();
            } else {
              console.error("❌ Failed to set cookie via server");
            }
          })
          .catch(error => {
            console.error("❌ Error calling set-cookie API:", error);
          });
      } else if (cookieExists) {
        console.log("✅ Token cookie already exists");
      }
    }
  }, [pathname]);

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/signup/umkm" ||
    pathname === "/signup/umkm/verification" ||
    pathname === "/reset-password";
  const isAdminPage = pathname.startsWith("/admin");
  const isUmkmPage = pathname.startsWith("/umkm");

  const navbarItems = [
    { title: "Beranda", link: "/", icon: <House size={20} /> },
    { title: "Tentang", link: "/about", icon: <Building size={20} /> },
    { title: "Produk", link: "/product", icon: <Coffee size={20} /> },
    { title: "Kegiatan", link: "/activity", icon: <CalendarCheck size={20} /> },
    { title: "Layanan", link: "/layanan", icon: <Settings size={20} /> },
  ];

  return (
    <>
      {!isAuthPage && !isAdminPage && !isUmkmPage && <Navbar navbarItems={navbarItems} />}
      <main>{children}</main>
    </>
  );
}