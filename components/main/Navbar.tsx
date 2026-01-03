"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getUser } from "../../app/utils/user";
import {
  Bell,
  LogOut,
  Menu,
  ShoppingBasket,
  ShoppingCart,
  X,
  ShieldUser,
} from "lucide-react";
import { logout } from "../../app/utils/auth";
import { useRouter, usePathname } from "next/navigation";
import { Dropdown } from "../dropdown/Dropdown";
import { DropdownItem } from "../dropdown/DropdownItem";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import ConfirmModal from "../ConfirmModal";
import { fetchAllCart } from "../../app/utils/cart";
import { UserItem } from "../../app/types/userType";
import Popup from "../Popup";
import NotificationDropdown from "../NotificationDropdown";
import { fetchNotifications } from "../../app/utils/notif";

interface NavbarItem {
  title: string;
  link: string;
  icon?: React.ReactNode;
}

export default function Navbar({ navbarItems }: { navbarItems: NavbarItem[] }) {
  const [user, setUser] = useState<UserItem | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);

  const pathname = usePathname();
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);

  // Add authentication check function
  const checkUserAuthentication = async (): Promise<boolean> => {
    try {
      await getUser();
      return true;
    } catch (error) {
      return false;
    }
  };

  // Handle protected navigation
  const handleProtectedNavigation = async (href: string, title: string) => {
    // Proteksi untuk halaman yang perlu login
    if (href === "/product" || href.startsWith("/layanan")) {
      try {
        const isLoggedIn = await checkUserAuthentication();
        if (!isLoggedIn) {
          router.push("/login");
          return;
        }
      } catch (error) {
        // Fallback jika ada error tak terduga
        router.push("/login");
        return;
      }
    }

    // Navigate normally untuk halaman lain atau jika sudah login
    router.push(href);
  };

  const handleLogout = () => {
    setShowConfirmModal(true);
  };

  // Fungsi untuk mengambil dan menghitung item unik di keranjang
  const fetchCartCount = async () => {
    try {
      const response = await fetchAllCart();
      const rawData = response?.data;

      if (rawData && Array.isArray(rawData) && rawData.length > 0) {
        const cartItems = rawData[0]?.cartItems;

        if (cartItems && Array.isArray(cartItems) && cartItems.length > 0) {
          const productNames = new Set(
            cartItems.map(
              (item: { product: { name: string } }) => item.product?.name
            )
          );
          setCartCount(productNames.size);
        } else {
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    } catch (error: any) {
      // Hanya log error jika bukan error autentikasi
      if (
        error?.type !== "general" ||
        !error?.message?.includes("Unauthorized")
      ) {
        console.error("Gagal mengambil data keranjang:", error);
      }
      setCartCount(0);
    }
  };

  // Fungsi untuk mengambil notifikasi baru (hanya 5 menit terakhir)
  const fetchRecentNotifications = async () => {
    try {
      const response = await fetchNotifications();
      const notifications = response.data;

      if (notifications && notifications.length > 0) {
        // Filter notifikasi yang belum dibaca dan dibuat dalam 5 menit terakhir
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const recentNotifications = notifications.filter((notif: any) => {
          const createdAt = new Date(notif.created_at);
          return !notif.viewed && createdAt > fiveMinutesAgo;
        });

        setNotificationCount(recentNotifications.length);
      } else {
        setNotificationCount(0);
      }
    } catch (error: any) {
      // Hanya log error jika bukan error autentikasi
      if (
        error?.type !== "general" ||
        !error?.message?.includes("Unauthorized")
      ) {
        console.error("Gagal mengambil notifikasi:", error);
      }
      setNotificationCount(0);
    }
  };

  // Fetch user data first
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUser();
        if (data) {
          setUser(data);
          // Fetch cart dan notifikasi hanya jika user sudah login
          fetchCartCount();
          fetchRecentNotifications();
        }
      } catch (error) {
        // User belum login, tidak perlu log error
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  // Listen to cart updates - hanya jika user sudah login
  useEffect(() => {
    if (!user) return;

    const handleCartUpdated = () => {
      fetchCartCount();
    };
    window.addEventListener("cartUpdated", handleCartUpdated);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
    };
  }, [user]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"; // Menonaktifkan scroll
    } else {
      document.body.style.overflow = "auto"; // Mengaktifkan scroll kembali
    }

    // Cleanup effect saat komponen unmount atau state berubah
    return () => {
      document.body.style.overflow = "auto"; // Pastikan overflow di-reset saat komponen unmount
    };
  }, [isMobileMenuOpen]);

  const toggleUserDropdown = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();

    // Check if dropdown is currently open
    if (isDropdownOpen) {
      // If open, close it
      closeUserDropdown();
    } else {
      // If closed, open it
      setIsDropdownOpen(true);
    }
  };

  const closeUserDropdown = () => setIsDropdownOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  return (
    <nav className="flex justify-between items-center p-3 shadow-md bg-white/80 fixed w-full z-50 px-4 md:px-8 lg:px-16">
      {showPopup && (
        <Popup
          message={popupMessage}
          type="error"
          onClose={() => setShowPopup(false)}
        />
      )}

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
      <Link href="/" className="flex items-center">
        <Image
          alt="Logo"
          src="/assets/logo.png"
          width={35}
          height={25}
          priority
          className="w-5 md:w-7"
        />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-6 lg:space-x-10 text-primary">
        {navbarItems.map((item, index) => {
          const isActive = pathname === item.link;
          return (
            <button
              key={index}
              onClick={() => handleProtectedNavigation(item.link, item.title)}
              className="relative group"
            >
              <span
                className={`relative after:content-[''] after:absolute after:left-0 after:-bottom-1/4 after:h-[2px] after:bg-primary after:transition-all after:duration-300
          ${isActive ? "after:w-full" : "after:w-0 group-hover:after:w-full"}`}
              >
                {item.title}
              </span>
            </button>
          );
        })}

        {/* 🔹 MENU UMKM (hanya untuk role umkm) */}
        {user?.role === "umkm" && (
          <button
            onClick={() => router.push("/umkm")}
            className="relative group"
          >
            <span
              className={`relative after:content-[''] after:absolute after:left-0 after:-bottom-1/4 after:h-[2px] after:bg-primary after:transition-all after:duration-300
        ${
          pathname === "/umkm"
            ? "after:w-full"
            : "after:w-0 group-hover:after:w-full"
        }`}
            >
              UMKM
            </span>
          </button>
        )}
      </div>

      {/* Desktop Auth */}
      <div className="hidden md:flex items-center space-x-4">
        {user ? (
          <div className="flex items-center gap-4 relative">
            {/* Bell Button */}
            <div className="relative">
              <NotificationDropdown />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                  {notificationCount > 99 ? "99+" : notificationCount}
                </span>
              )}
            </div>

            {/* Cart Link */}
            <Link href="/cart" className="text-primary relative">
              <ShoppingCart width={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Button */}
            <div className="relative">
              <button
                onClick={toggleUserDropdown}
                className="dropdown-toggle flex items-center text-primary"
              >
                <span className="mr-3 overflow-hidden rounded-full h-10 w-10">
                  <Image
                    width={44}
                    height={44}
                    src={user.image || "/assets/user.png"}
                    alt={user.name ?? ""}
                  />
                </span>

                <span className="block mr-1 text-sm font-medium">
                  {user.name}
                </span>

                <svg
                  className={`stroke-gray-500 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  width="18"
                  height="20"
                  viewBox="0 0 18 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <Dropdown
                  isOpen={true}
                  onClose={closeUserDropdown}
                  className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-300 bg-white p-3 shadow-theme-lg"
                >
                  <div>
                    <span className="block font-medium text-sm text-gray-700">
                      {user.name}
                    </span>
                    <span className="mt-0.5 block text-sm text-gray-500">
                      {user.email || "user@example.com"}
                    </span>
                  </div>

                  <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200">
                    <li>
                      <DropdownItem
                        onItemClick={closeUserDropdown}
                        tag="a"
                        href="/profile"
                        className="flex items-center font-medium gap-3 px-3 py-2 text-gray-700 rounded-lg group hover:bg-gray-100 hover:text-gray-700 "
                      >
                        <svg
                          className="fill-gray-500 group-hover:fill-gray-700"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 14.1526 4.3002 16.1184 5.61936 17.616C6.17279 15.3096 8.24852 13.5955 10.7246 13.5955H13.2746C15.7509 13.5955 17.8268 15.31 18.38 17.6167C19.6996 16.119 20.5 14.153 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5ZM17.0246 18.8566V18.8455C17.0246 16.7744 15.3457 15.0955 13.2746 15.0955H10.7246C8.65354 15.0955 6.97461 16.7744 6.97461 18.8455V18.856C8.38223 19.8895 10.1198 20.5 12 20.5C13.8798 20.5 15.6171 19.8898 17.0246 18.8566ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.9991 7.25C10.8847 7.25 9.98126 8.15342 9.98126 9.26784C9.98126 10.3823 10.8847 11.2857 11.9991 11.2857C13.1135 11.2857 14.0169 10.3823 14.0169 9.26784C14.0169 8.15342 13.1135 7.25 11.9991 7.25ZM8.48126 9.26784C8.48126 7.32499 10.0563 5.75 11.9991 5.75C13.9419 5.75 15.5169 7.32499 15.5169 9.26784C15.5169 11.2107 13.9419 12.7857 11.9991 12.7857C10.0563 12.7857 8.48126 11.2107 8.48126 9.26784Z"
                            fill=""
                          />
                        </svg>
                        Edit profil
                      </DropdownItem>
                    </li>
                    <li>
                      <DropdownItem
                        onItemClick={closeUserDropdown}
                        tag="a"
                        href="/order"
                        className="flex items-center font-medium gap-3 px-3 py-2 text-gray-700 rounded-lg group hover:bg-gray-100 hover:text-gray-700 "
                      >
                        <ShoppingBasket
                          size={23}
                          color="#77767b"
                          strokeWidth={1.5}
                        />
                        Pesanan Saya
                      </DropdownItem>
                    </li>
                    {/* <li>
                      <DropdownItem
                        onItemClick={closeUserDropdown}
                        tag="a"
                        href="/admin"
                        className={clsx(
                          "flex items-center font-medium gap-3 px-3 py-2 text-gray-700 rounded-lg group hover:bg-gray-100 hover:text-gray-700",
                          user?.admin !== true && "hidden"
                        )}
                      >
                        <ShieldUser
                          size={23}
                          color="#77767b"
                          strokeWidth={1.5}
                        />
                        Menu Admin
                      </DropdownItem>
                    </li> */}
                  </ul>
                  <div
                    onClick={handleLogout}
                    className="cursor-pointer flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 group text-sm hover:bg-gray-100 hover:text-gray-700"
                  >
                    <svg
                      className="fill-gray-500 group-hover:fill-gray-700"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497L14.3507 14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497L20.7507 5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501L14.3507 9.74501V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609L18.5007 4.74609C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609L19.2507 18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007ZM3.25073 11.9984C3.25073 12.2144 3.34204 12.4091 3.48817 12.546L8.09483 17.1556C8.38763 17.4485 8.86251 17.4487 9.15549 17.1559C9.44848 16.8631 9.44863 16.3882 9.15583 16.0952L5.81116 12.7484L16.0007 12.7484C16.4149 12.7484 16.7507 12.4127 16.7507 11.9984C16.7507 11.5842 16.4149 11.2484 16.0007 11.2484L5.81528 11.2484L9.15585 7.90554C9.44864 7.61255 9.44847 7.13767 9.15547 6.84488C8.86248 6.55209 8.3876 6.55226 8.09481 6.84525L3.52309 11.4202C3.35673 11.5577 3.25073 11.7657 3.25073 11.9984Z"
                        fill=""
                      />
                    </svg>
                    Keluar
                  </div>
                </Dropdown>
              )}
            </div>
          </div>
        ) : (
          <>
            <Link href="/login">
              <button className="bg-primary px-3 py-1.5 rounded-xl text-white hover:-translate-y-1 duration-150 ease-in">
                Masuk
              </button>
            </Link>
            <Link href="/signup">
              <button className="text-primary px-3 py-1.5 rounded-xl border border-primary hover:-translate-y-1 duration-150 ease-in">
                Daftar
              </button>
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden p-2" onClick={toggleMobileMenu}>
        <Menu size={24} />
      </button>

      {/* Mobile Menu - Sidebar style */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Overlay */}
            <motion.div
              className="absolute inset-0 bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              className="relative z-50 w-64 bg-white h-full shadow-xl ml-auto flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-4">
                <Image
                  src="/assets/logo.png"
                  alt="Logo"
                  width={24}
                  height={24}
                />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 overflow-y-auto">
                <ul className="space-y-4">
                  {navbarItems.map((item, index) => {
                    const isActive = pathname === item.link;
                    const icon = item.icon || (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-primary font-medium">
                        {item.title.charAt(0)}
                      </div>
                    );

                    return (
                      <li key={index}>
                        <button
                          onClick={async () => {
                            await handleProtectedNavigation(
                              item.link,
                              item.title
                            );
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full"
                        >
                          <div
                            className={clsx(
                              "flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 text-sm",
                              isActive
                                ? "bg-primary text-white font-medium shadow-lg"
                                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            )}
                          >
                            {icon}
                            <span>{item.title}</span>
                          </div>
                        </button>
                      </li>
                    );
                  })}

                  {/* Menu Pesanan Saya - hanya tampil di mobile dan jika user login */}
                  {user && (
                    <li>
                      <Link
                        href="/order"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div
                          className={clsx(
                            "flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 text-sm",
                            pathname === "/order"
                              ? "bg-primary text-white font-medium shadow-lg"
                              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          )}
                        >
                          <ShoppingBasket size={20} />
                          <span>Pesanan Saya</span>
                        </div>
                      </Link>
                    </li>
                  )}

                  
                </ul>
              </nav>

              {/* Footer with user profile */}
              <div className="mt-auto px-4 py-4 bg-gray-100 flex items-center justify-between rounded-t-xl">
                {user ? (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <button className="text-primary">
                          <Bell size={20} />
                        </button>
                        {notificationCount > 0 && (
                          <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                            {notificationCount > 9 ? "9+" : notificationCount}
                          </span>
                        )}
                      </div>
                      <Link href="/cart" className="text-primary relative">
                        <ShoppingCart size={20} />
                        {cartCount > 0 && (
                          <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                            {cartCount}
                          </span>
                        )}
                      </Link>
                    </div>

                    <div
                      className="flex items-center gap-2"
                      onClick={() => {
                        router.push("/profile");
                      }}
                    >
                      <Image
                        src={user.image || "/assets/user.png"}
                        alt="avatar"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">User</p>
                      </div>
                    </div>
                    <LogOut
                      size={20}
                      className="text-gray-700 cursor-pointer"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                    />
                  </>
                ) : (
                  <div className="flex flex-col w-full gap-2 text-sm">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <button className="bg-primary w-full py-2 rounded-xl text-white">
                        Masuk
                      </button>
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <button className="w-full border border-primary py-2 rounded-xl text-primary">
                        Daftar
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
