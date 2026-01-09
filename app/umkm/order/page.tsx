// app\umkm\order\page.tsx
"use client";

import OrderTable, { Order, OrderStatus } from "@/components/order/OrderTable";
import { fetchAllUMKMOrder } from "@/app/utils/order-umkm";
import { updateStatusOrder } from "@/app/utils/order";
import { useEffect, useState } from "react";
import OrderDetailModal from "@/components/order/OrderDetailModal";
import { formatCurrency } from "@/app/utils/helper";
import ConfirmModal from "@/components/ConfirmModal";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  FunnelPlus,
  Phone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { callPartner } from "@/app/utils/partner";
import Popup from "@/components/Popup";

export default function UMKMOrderPage() {
  const [ordersData, setOrdersData] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<{
    orderId: number;
    newStatus: OrderStatus;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
  const [contactedPartners, setContactedPartners] = useState<number[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error">("success");

  const [statusSortOrder, setStatusSortOrder] = useState<"asc" | "desc">("asc");
  const [sortOption, setSortOption] = useState<"newest" | "oldest" | "az">(
    "newest"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);

  const statusPriority: OrderStatus[] = [
    "PROCESSING",
    "SHIPPED",
    // "DELIVERED",
    // "CANCELED",
  ];

  const filteredOrders =
    statusFilter === "ALL"
      ? ordersData
      : ordersData.filter((order) => order.status === statusFilter);

  // Fungsi map status API ke enum status frontend
  // PENDING otomatis diubah ke PROCESSING
  const mapApiStatus = (apiStatus: string | undefined | null): OrderStatus => {
    if (!apiStatus) return "PROCESSING"; // Handle undefined/null
    const upper = apiStatus.toUpperCase();
    // PENDING dan CREATED otomatis menjadi PROCESSING
    if (["PENDING", "CREATED"].includes(upper)) return "PROCESSING";
    if (["PROCESSING"].includes(upper)) return "PROCESSING";
    if (["SHIPPED"].includes(upper)) return "SHIPPED";
    if (["DELIVERED", "SUCCESS", "COMPLETED", "PAID"].includes(upper))
      return "DELIVERED";
    if (["CANCELED", "FAILED"].includes(upper)) return "CANCELED";
    return "PROCESSING"; // fallback ke PROCESSING
  };

  // Ambil data order dari API - TANPA FILTERING USER
  useEffect(() => {
    const getOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchAllUMKMOrder();
        console.log("Full API response:", response);
        const rawData = response.data;
        console.log("Raw order data:", rawData);

        if (!Array.isArray(rawData)) {
          console.error("Expected array but got:", typeof rawData, rawData);
          setError("Failed to load orders: Invalid data format.");
          return;
        }

        // TIDAK ADA FILTERING - Langsung proses semua data
        const processedOrders: Order[] = rawData.map((order: any) => {
          const totalQuantity =
            order.items?.reduce(
              (sum: number, item: any) => sum + (item.quantity || 0),
              0
            ) || 0;
          const totalPrice = order.payment?.amount || 0;
          const productNameString =
            order.items
              ?.map((item: any) => item.name)
              .filter(Boolean)
              .join(", ") || "Produk tidak tersedia";

          const partnerList =
            order.items?.map((item: any) => item.partner) || [];

          return {
            id: order.orderId,
            customerName: order.customerName || "N/A",
            productName: productNameString,
            totalQuantity,
            totalPrice: formatCurrency(totalPrice),
            status: mapApiStatus(order.statusOrder),
            createdAt: order.createdAt,
            partnerName: partnerList[0]?.name || null,
            orderItems: order.items || [],
          };
        });

        console.log("Processed orders:", processedOrders);
        setOrdersData(processedOrders);
      } catch (err: any) {
        console.error("Failed to fetch orders:", err);
        console.error("Error details:", {
          message: err?.message,
          type: err?.type,
          response: err?.response,
          stack: err?.stack,
        });
        setError(`Failed to load orders: ${err.message || "Unknown error"}`);
      } finally {
        setIsLoading(false);
      }
    };

    getOrders();
  }, []);

  // Sort orders sesuai filter dropdown dan status sort
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    // Sort berdasarkan pilihan filter utama (newest, oldest, az)
    if (sortOption === "newest" || sortOption === "oldest") {
      const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;

      if (aDate !== bDate) {
        return sortOption === "newest" ? bDate - aDate : aDate - bDate;
      }
    }

    if (sortOption === "az") {
      const aName = a.customerName.toLowerCase();
      const bName = b.customerName.toLowerCase();
      if (aName !== bName) return aName < bName ? -1 : 1;
    }

    // Jika masih sama, urutkan berdasarkan status
    const aStatusIndex = statusPriority.indexOf(a.status);
    const bStatusIndex = statusPriority.indexOf(b.status);
    return statusSortOrder === "asc"
      ? aStatusIndex - bStatusIndex
      : bStatusIndex - aStatusIndex;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

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

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, sortOption, statusSortOrder]);

  // Handler tombol lihat detail
  const handleViewOrder = (orderId: number) => {
    router.push(`/umkm/order/${orderId}`);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
  };

  // Handler perubahan status pesanan (buka konfirmasi)
  const handleStatusBadge = (orderId: number, newStatus: OrderStatus) => {
    setPendingStatus({ orderId, newStatus });
    setIsConfirmOpen(true);
  };

  // Konfirmasi perubahan status
  const confirmStatusChange = async () => {
    if (!pendingStatus) return;

    try {
      setIsSubmitting(true);
      const response = await updateStatusOrder(
        pendingStatus.orderId,
        pendingStatus.newStatus
      );

      setOrdersData((prev) =>
        prev.map((order) =>
          order.id === pendingStatus.orderId
            ? { ...order, status: pendingStatus.newStatus }
            : order
        )
      );
      setMessage(response.message);
      setPopupType("success");
      setShowPopup(true);
    } catch (error: any) {
      console.error("Gagal update status:", error);
      setMessage(error.message || "Gagal mengubah status pesanan.");
      setPopupType("error");
      setShowPopup(true);
    } finally {
      setIsSubmitting(false);
      setIsConfirmOpen(false);
      setPendingStatus(null);
    }
  };

  // Toggle status sort (asc / desc)
  function toggleStatusSort(): void {
    setStatusSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  }

  // Function to get Indonesian label for status
  const getStatusLabel = (status: OrderStatus): string => {
    switch (status) {
      // case "PENDING":
        // return "Dibuat";
      case "PROCESSING":
        return "Diproses";
      case "SHIPPED":
        return "Dikirim";
      // case "DELIVERED":
      //   return "Diterima";
      // case "CANCELED":
      //   return "Dibatalkan";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto">
        {/* Header Skeleton */}
        <div className="flex flex-wrap justify-between items-center mb-4">
          <h1 className="text-lg font-medium">List Order</h1>

          {/* Filters - Moved to the right */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as OrderStatus | "ALL")
                }
                className="appearance-none border border-gray-500 rounded-xl px-3 py-2 text-sm pr-8"
              >
                <option value="ALL">Semua Status</option>
                <option value="PROCESSING">Diproses</option>
                <option value="SHIPPED">Dikirim</option>
                {/* <option value="DELIVERED">Diterima</option>
                <option value="CANCELED">Dibatalkan</option> */}
              </select>
              <FunnelPlus
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                size={18}
              />
            </div>

            {/* Sort Filter */}
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) =>
                  setSortOption(e.target.value as "newest" | "oldest" | "az")
                }
                className="appearance-none border border-gray-500 rounded-xl px-3 py-2 text-sm pr-8"
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="az">Nama A-Z</option>
              </select>
              <FunnelPlus
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                size={18}
              />
            </div>
          </div>
        </div>

        {/* Partner Contact Section Skeleton */}
        <div className="mb-4 p-4 bg-secondary rounded-xl shadow-lg animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-48 mb-3"></div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-8 bg-gray-300 rounded-xl w-32"></div>
            ))}
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-tertiary shadow-lg rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-primary text-xs sm:text-sm text-white">
                <tr>
                  <th className="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">
                    Nama Customer
                  </th>
                  <th className="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">
                    Nama Produk
                  </th>
                  <th className="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">
                    Nama Mitra
                  </th>
                  <th className="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">
                    Quantity Total
                  </th>
                  <th className="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">
                    Total Harga
                  </th>
                  <th className="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">
                    Detail
                  </th>
                </tr>
              </thead>
              <tbody className="text-xs sm:text-sm text-gray-700 divide-y divide-gray-200">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-2 sm:px-4 py-3">
                      <div className="h-4 bg-gray-300 rounded w-28"></div>
                    </td>
                    <td className="px-2 sm:px-4 py-3">
                      <div className="h-4 bg-gray-300 rounded w-36"></div>
                    </td>
                    <td className="px-2 sm:px-4 py-3">
                      <div className="h-4 bg-gray-300 rounded w-24"></div>
                    </td>
                    <td className="px-2 sm:px-4 py-3">
                      <div className="h-4 bg-gray-300 rounded w-12"></div>
                    </td>
                    <td className="px-2 sm:px-4 py-3">
                      <div className="h-4 bg-gray-300 rounded w-24"></div>
                    </td>
                    <td className="px-2 sm:px-4 py-3">
                      <div className="h-6 bg-gray-300 rounded-xl w-20"></div>
                    </td>
                    <td className="px-2 sm:px-4 py-3">
                      <div className="h-8 w-8 bg-gray-300 rounded-xl"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Skeleton */}
        <div className="flex flex-col items-center space-y-4 mt-5">
          <div className="h-4 bg-gray-300 rounded w-48 animate-pulse"></div>
          <div className="flex items-center space-x-1">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="h-8 w-8 bg-gray-300 rounded-full animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error)
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;

  if (ordersData.length === 0)
    return (
      <div className="p-4 text-center text-gray-500">
        Belum ada pesanan yang tersedia.
      </div>
    );

  return (
    <div className="">
      {showPopup && (
        <Popup
          message={message}
          type={popupType}
          onClose={() => setShowPopup(false)}
        />
      )}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setPendingStatus(null);
        }}
        onConfirm={confirmStatusChange}
        title="Konfirmasi Perubahan Status"
        description={`Apakah Anda yakin ingin mengubah status pesanan menjadi "${
          pendingStatus?.newStatus
            ? getStatusLabel(pendingStatus.newStatus)
            : ""
        }"?`}
        isSubmitting={isSubmitting}
      />

      <div className="mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <h1 className="text-lg font-medium">
            List Order
            {!isLoading && ordersData.length > 0 && (
              <span className="text-sm text-gray-500 ml-2">
                ({ordersData.length} pesanan)
              </span>
            )}
          </h1>

          {/* Filters - Moved to the right */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as OrderStatus | "ALL")
                }
                className="appearance-none border border-gray-500 rounded-xl px-3 py-2 text-sm pr-8"
              >
                <option value="ALL">Semua Status</option>
                <option value="PROCESSING">Diproses</option>
                <option value="SHIPPED">Dikirim</option>
                {/* <option value="DELIVERED">Diterima</option>
                <option value="CANCELED">Dibatalkan</option> */}
              </select>
              <FunnelPlus
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                size={18}
              />
            </div>

            {/* Sort Filter */}
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) =>
                  setSortOption(e.target.value as "newest" | "oldest" | "az")
                }
                className="appearance-none border border-gray-500 rounded-xl px-3 py-2 text-sm pr-8"
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="az">Nama A-Z</option>
              </select>
              <FunnelPlus
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                size={18}
              />
            </div>
          </div>
        </div>

        <OrderTable
          order={currentOrders}
          onView={handleViewOrder}
          onStatusChange={handleStatusBadge}
          onToggleStatusSort={toggleStatusSort}
          statusSortOrder={statusSortOrder}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center space-y-4 mt-5">
            {/* Pagination Info */}
            <div className="text-sm text-gray-600">
              Menampilkan {startIndex + 1}-
              {Math.min(endIndex, filteredOrders.length)} dari{" "}
              {filteredOrders.length} pesanan
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center space-x-1">
              {/* Previous Button */}
              <button
                onClick={goToPrevious}
                disabled={currentPage === 1}
                className=" hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={23} />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {getPageNumbers().map((page, index) =>
                  page === "..." ? (
                    <span key={index} className="px-3 py-2 text-gray-500">
                      ...
                    </span>
                  ) : (
                    <button
                      key={index}
                      onClick={() => goToPage(page as number)}
                      className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm ${
                        currentPage === page
                          ? "bg-primary text-white border-primary"
                          : "border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              {/* Next Button */}
              <button
                onClick={goToNext}
                disabled={currentPage === totalPages}
                className=" hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={23} />
              </button>
            </div>
          </div>
        )}
      </div>

      <OrderDetailModal
        isOpen={isModalOpen}
        orderId={selectedOrderId}
        onClose={handleCloseModal}
      />
    </div>
  );
}
