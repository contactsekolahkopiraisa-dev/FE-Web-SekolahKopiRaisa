// components\main\Sidebar.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, ChevronDown, LogOut, Menu, X } from "lucide-react";
import clsx from "clsx";
import { logout } from "../../app/utils/auth";
import { getUser } from "../../app/utils/user";
import { AnimatePresence, motion } from "framer-motion";
import ConfirmModal from "../ConfirmModal";

interface SidebarChildItemType {
  icon?: React.ReactNode;
  text: string;
  href: string;
}

interface SidebarItemType {
  icon: React.ReactNode;
  text: string;
  href?: string;
  subItems?: SidebarChildItemType[];
  children?: SidebarChildItemType[]; // Tambahkan property children
}

interface User {
  name: string;
  image: string;
  role?: string;
}

export default function Sidebar({ items }: { items: SidebarItemType[] }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

  const handleLogout = () => {
    setShowConfirmModal(true);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUser();
        if (data) setUser(data);
      } catch (error) {
        console.error("Gagal mendapatkan user:", error);
      }
    };
    fetchUser();
  }, []);

  const handleProfileNavigation = () => {
    if (user?.role?.toLowerCase() === "umkm") {
      router.push("/umkm/profile");
    } else {
      router.push("/admin/profile");
    }
  };

  const toggleDropdown = (text: string) => {
    setOpenDropdowns((prev) =>
      prev.includes(text)
        ? prev.filter((item) => item !== text)
        : [...prev, text]
    );
  };

  const renderSidebarContent = (isMobile = false) => (
    <div
      className={clsx(
        "bg-white h-full shadow-lg flex flex-col justify-between duration-300",
        isMobile ? "w-64" : isSidebarOpen ? "w-50" : "w-20"
      )}
    >
      {/* Header */}
      <div
        className={clsx(
          "flex items-center px-4 py-4",
          isSidebarOpen ? "justify-between" : "flex-col gap-3 justify-center"
        )}
      >
        <Image src="/assets/logo.png" alt="Logo" width={20} height={20} />
        {isMobile ? (
          <button onClick={() => setMobileOpen(false)}>
            <X />
          </button>
        ) : (
          <div
            className="relative w-6 h-6 cursor-pointer"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            <Menu
              className={clsx(
                "absolute transition-all duration-300",
                isSidebarOpen
                  ? "opacity-0 scale-90 rotate-45"
                  : "opacity-100 scale-100 rotate-0"
              )}
            />
            <X
              className={clsx(
                "absolute transition-all duration-300",
                isSidebarOpen
                  ? "opacity-100 scale-100 rotate-0"
                  : "opacity-0 scale-90 -rotate-45"
              )}
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 overflow-y-auto">
        <ul className="space-y-3">
          {items.map((item) => {
            const sidebarOpen = isMobile ? true : isSidebarOpen;
            const isOpenByPath = item.href
              ? pathname.startsWith(item.href)
              : false;

            // Jika item memiliki children, render sebagai SidebarGroup
            if (
              (item.children && item.children.length > 0) ||
              (item.subItems && item.subItems.length > 0)
            ) {
              const childrenItems = item.children || item.subItems || [];
              return (
                <SidebarGroup
                  key={item.text}
                  icon={item.icon}
                  text={item.text}
                  childrenItems={childrenItems}
                  isSidebarOpen={sidebarOpen}
                  isActiveParent={isOpenByPath}
                  pathname={pathname}
                />
              );
            }

            // Jika tidak ada href, skip
            if (!item.href) return null;

            // Render sebagai SidebarItem biasa
            return (
              <SidebarItem
                key={item.text}
                icon={item.icon}
                text={item.text}
                href={item.href}
                subItems={item.subItems}
                isActive={pathname === item.href}
                isSidebarOpen={sidebarOpen}
                isDropdownOpen={openDropdowns.includes(item.text)}
                onToggleDropdown={() => toggleDropdown(item.text)}
                pathname={pathname}
              />
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="cursor-pointer px-3 py-3 bg-gray-100 flex items-center justify-between rounded-t-xl">
        <div
          className="flex items-center gap-2"
          onClick={handleProfileNavigation}
        >
          <Image
            src={user?.image || "/assets/user.png"}
            alt="avatar"
            width={35}
            height={35}
            className="rounded-full"
          />
          {(isMobile || isSidebarOpen) && (
            <div>
              <p className="text-xs font-medium">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role || "Admin"}</p>
            </div>
          )}
        </div>
        <LogOut
          size={20}
          className="text-gray-700 cursor-pointer"
          onClick={handleLogout}
        />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block">{renderSidebarContent()}</aside>

      {showConfirmModal && (
        <ConfirmModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={async () => {
            await logout();
            router.replace("/login");
            setShowConfirmModal(false);
          }}
          title="Konfirmasi Logout"
          description="Apakah Anda yakin ingin Logout?"
        />
      )}

      {/* Mobile Sidebar (overlay) */}
      <div className="md:hidden">
        {!isMobileOpen && (
          <button
            className="fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow-lg"
            onClick={() => setMobileOpen(true)}
          >
            <Menu />
          </button>
        )}

        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              className="fixed inset-0 z-40 flex"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute inset-0 bg-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setMobileOpen(false)}
              />

              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.3 }}
                className="relative z-50 w-64 bg-white h-full shadow-lg"
              >
                {renderSidebarContent(true)}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function SidebarItem({
  icon,
  text,
  href,
  subItems,
  isActive,
  isSidebarOpen,
  isDropdownOpen,
  onToggleDropdown,
  pathname
}: {
  icon: React.ReactNode;
  text: string;
  href?: string;
  subItems?: SidebarChildItemType[];
  isActive: boolean;
  isSidebarOpen: boolean;
  isDropdownOpen?: boolean;
  onToggleDropdown?: () => void;
  pathname: string;
}) {
  const hasActiveSubItem = subItems?.some((sub) => pathname === sub.href);

  if (subItems && subItems.length > 0) {
    return (
      <li>
        <div
          className={clsx(
            "flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer text-sm",
            hasActiveSubItem
              ? "bg-primary text-white font-medium shadow-lg"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
            !isSidebarOpen && "justify-center"
          )}
          onClick={onToggleDropdown}
        >
          {icon}
          {isSidebarOpen && (
            <>
              <span className="flex-1">{text}</span>
              {isDropdownOpen ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </>
          )}
        </div>

        {isSidebarOpen && isDropdownOpen && (
          <ul className="ml-8 mt-2 space-y-2">
            {subItems.map((subItem) => (
              <li key={subItem.href}>
                <Link href={subItem.href}>
                  <div
                    className={clsx(
                      "flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer text-sm",
                      pathname === subItem.href
                        ? "bg-primary text-white font-medium"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    {subItem.icon && subItem.icon}
                    <span>{subItem.text}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li>
      <Link href={href || "#"}>
        <div
          className={clsx(
            "flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer text-sm",
            isActive
              ? "bg-primary text-white font-medium shadow-lg"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
            !isSidebarOpen && "justify-center"
          )}
        >
          {icon}
          {isSidebarOpen && <span>{text}</span>}
        </div>
      </Link>
    </li>
  );
}

function SidebarGroup({
  icon,
  text,
  childrenItems,
  isSidebarOpen,
  isActiveParent,
  pathname
}: {
  icon: React.ReactNode;
  text: string;
  childrenItems: SidebarChildItemType[];
  isSidebarOpen: boolean;
  isActiveParent: boolean;
  pathname: string;
}) {
  const [openInternal, setOpenInternal] = useState(false);
  const open = isSidebarOpen ? openInternal || isActiveParent : false;

  return (
    <li>
      <button
        type="button"
        className={clsx(
          "w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer text-sm",
          isActiveParent
            ? "bg-primary text-white font-medium shadow-lg"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
          !isSidebarOpen && "justify-center"
        )}
        onClick={() => setOpenInternal(!openInternal)}
      >
        {icon}
        {isSidebarOpen && (
          <div className="flex-1 flex items-center justify-between">
            <span>{text}</span>
            {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>
        )}
      </button>
      {isSidebarOpen && open && (
        <ul className="mt-2 ml-8 space-y-2">
          {childrenItems.map((child) => (
            <li key={child.href}>
              <Link href={child.href}>
                <div
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer text-sm",
                    pathname === child.href
                      ? "bg-primary text-white font-medium shadow-lg"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  {child.icon}
                  <span>{child.text}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
