// app/order/page.tsx

"use client";

import { useEffect, useState } from "react";
import { fetchMyOrder } from "../utils/order";
import OrderCard, { OrderItem } from "../components/OrderCard";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Package,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

// Update the OrderStatus type to include all possible statuses
type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELED";

interface Order {
  orderId: number;
  statusOrder: OrderStatus;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: string;
  payment: {
    method: string;
    statusPembayaran: string;
    amount: number;
    Snap?: string;
    snapRedirectUrl?: string;
  };
}

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"ongoing" | "history">("ongoing");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const router = useRouter();

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const result = await fetchMyOrder();
        setOrders(result.orders || []);
      } catch (err) {
        console.error("Gagal memuat pesanan", err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleDetailClick = (orderId: number) => {
    router.push(`/order/${orderId}`);
  };

  // Filter orders based on active tab
  const filteredOrders =
    activeTab === "ongoing"
      ? orders.filter((order) =>
          ["PENDING", "PROCESSING", "SHIPPED"].includes(order.statusOrder)
        )
      : orders.filter((order) =>
          ["DELIVERED", "CANCELED"].includes(order.statusOrder)
        );

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  // Reset to page 1 when switching tabs
  const handleTabChange = (tab: "ongoing" | "history") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Update the empty state message
  const getEmptyMessage = () => {
    if (activeTab === "ongoing") {
      return "Tidak ada pesanan yang sedang berjalan.";
    } else {
      return "Belum ada riwayat pesanan selesai atau dibatalkan.";
    }
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 shadow-lg animate-pulse"
        >
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Empty state component
  const EmptyState = ({ type }: { type: "ongoing" | "history" }) => {
    const icon =
      type === "ongoing" ? (
        <Clock className="w-16 h-16 text-gray-300 mb-4" />
      ) : (
        <Package className="w-16 h-16 text-gray-300 mb-4" />
      );

    const title =
      type === "ongoing"
        ? "Belum Ada Pesanan Aktif"
        : "Belum Ada Riwayat Pesanan";

    const description =
      type === "ongoing"
        ? "Anda belum memiliki pesanan yang sedang berjalan"
        : "Belum ada pesanan yang selesai atau dibatalkan";

    return (
      <div className="bg-white rounded-xl p-12 text-center shadow-lg">
        <div className="flex justify-center">{icon}</div>
        <h3 className="text-md font-medium text-gray-700 mb-2">{title}</h3>
        <p className="text-gray-500 max-w-md mx-auto">{description}</p>
      </div>
    );
  };

  return (
    <div className="bg-secondary min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-lg font-medium text-gray-800 mb-2">
            Pesanan Saya
          </h1>
          <p className="text-gray-600">Kelola dan pantau semua pesanan Anda</p>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="bg-white rounded-xl p-2 mb-8 shadow-lg inline-flex">
          <button
            onClick={() => handleTabChange("ongoing")}
            className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
              activeTab === "ongoing"
                ? "bg-primary text-white shadow-lg transform scale-105"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <Clock size={18} />
            <span>Sedang Berjalan</span>
            {activeTab === "ongoing" && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            )}
          </button>
          <button
            onClick={() => handleTabChange("history")}
            className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
              activeTab === "history"
                ? "bg-primary text-white shadow-lg transform scale-105"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <Package size={18} />
            <span>Riwayat Pesanan</span>
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-md font-medium text-gray-800">
                  {orders.filter((o) => o.statusOrder === "PENDING").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Diproses</p>
                <p className="text-md font-medium text-gray-800">
                  {orders.filter((o) => o.statusOrder === "PROCESSING").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Selesai</p>
                <p className="text-md font-medium text-gray-800">
                  {orders.filter((o) => o.statusOrder === "DELIVERED").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Dibatalkan</p>
                <p className="text-md font-medium text-gray-800">
                  {orders.filter((o) => o.statusOrder === "CANCELED").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSkeleton />
        ) : filteredOrders.length === 0 ? (
          <EmptyState type={activeTab} />
        ) : (
          <>
            {/* Results Info */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Menampilkan{" "}
                <span className="font-medium">{filteredOrders.length}</span>{" "}
                pesanan
              </p>
              <div className="text-sm text-gray-500">
                Halaman {currentPage} dari {totalPages}
              </div>
            </div>

            {/* Order List */}
            <div className="space-y-6 mb-8">
              {currentOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="cursor-pointer transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                  onClick={() => handleDetailClick(order.orderId)}
                >
                  <OrderCard order={order} />
                </div>
              ))}
            </div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                  <div className="text-sm text-gray-600">
                    Menampilkan{" "}
                    <span className="font-medium">
                      {startIndex + 1}-
                      {Math.min(endIndex, filteredOrders.length)}
                    </span>{" "}
                    dari{" "}
                    <span className="font-medium">{filteredOrders.length}</span>{" "}
                    pesanan
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={goToPrevious}
                      disabled={currentPage === 1}
                      className="flex items-center space-x-2 px-4 py-2  disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <ChevronLeft size={23} />
                    </button>

                    <div className="flex items-center space-x-1">
                      {getPageNumbers().map((page, index) =>
                        page === "..." ? (
                          <span key={index} className="px-3 py-2 text-gray-400">
                            ...
                          </span>
                        ) : (
                          <button
                            key={index}
                            onClick={() => goToPage(page as number)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                              currentPage === page
                                ? "bg-primary text-white shadow-lg transform scale-110"
                                : "border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                    </div>

                    <button
                      onClick={goToNext}
                      disabled={currentPage === totalPages}
                      className="flex items-center space-x-2 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <ChevronRight size={23} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
