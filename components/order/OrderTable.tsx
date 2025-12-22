// components\order\OrderTable.tsx
"use client";

import {
  Loader,
  XCircle,
  Truck,
  PackageCheck,
  ChevronDown,
  ChevronUp,
  Expand,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Interface untuk setiap item pesanan
export interface Order {
  id: number;
  customerName: string;
  productName: string;
  totalQuantity: number;
  totalPrice: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELED";
  notes?: string;
  partnerName?: string;
  price?: number;
  quantity?: number;
  createdAt?: string;
}

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELED";

const ALL_STATUSES: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELED",
];

interface OrderTableProps {
  order: Order[];
  onView: (id: number) => void;
  onStatusChange: (id: number, newStatus: OrderStatus) => void;
  onToggleStatusSort: () => void;
  statusSortOrder: "asc" | "desc";
}

// ✅ Helper function to get user role from localStorage
const getUserRole = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("role");
  }
  return null;
};

// ✅ Helper function to filter statuses based on role
const getAvailableStatuses = (userRole: string | null): OrderStatus[] => {
  if (userRole === "umkm") {
    // UMKM hanya bisa akses PENDING, PROCESSING, dan SHIPPED
    return ["PENDING", "PROCESSING", "SHIPPED"];
  }
  // Role lain (admin, customer, dll) bisa akses semua status
  return ALL_STATUSES;
};

function StatusDropdown({
  currentStatus,
  orderId,
  onStatusChange,
  isOpen,
  onToggle,
}: {
  currentStatus: OrderStatus;
  orderId: number;
  onStatusChange: (id: number, newStatus: OrderStatus) => void;
  isOpen: boolean;
  onToggle: (id: number) => void;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  // ✅ Get user role on component mount
  useEffect(() => {
    setUserRole(getUserRole());
  }, []);

  // ❇️ Tutup bila klik di luar
  useEffect(() => {
    if (!isOpen) return; // pasang listener hanya saat terbuka

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        onToggle(-1); // tutup dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onToggle]);

  const handleSelectStatus = (newStatus: OrderStatus) => {
    if (newStatus !== currentStatus) {
      onStatusChange(orderId, newStatus);
    }
    onToggle(-1); // Tutup dropdown setelah memilih
  };

  // Function to get Indonesian label for status
  const getStatusLabel = (status: OrderStatus): string => {
    switch (status) {
      case "PENDING":
        return "Dibuat";
      case "PROCESSING":
        return "Diproses";
      case "SHIPPED":
        return "Dikirim";
      case "DELIVERED":
        return "Diterima";
      case "CANCELED":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  let statusColorClass = "";
  let statusIcon = null;

  switch (currentStatus) {
    case "PENDING":
      statusColorClass = "bg-gray-100 text-gray-800";
      statusIcon = <Loader size={18} className="mr-1.5" />;
      break;
    case "PROCESSING":
      statusColorClass = "bg-yellow-100 text-yellow-800";
      statusIcon = <Loader size={18} className="animate-spin mr-1.5" />;
      break;
    case "SHIPPED":
      statusColorClass = "bg-blue-100 text-blue-800";
      statusIcon = <Truck size={18} className="mr-1.5" />;
      break;
    case "DELIVERED":
      statusColorClass = "bg-green-100 text-green-800";
      statusIcon = <PackageCheck size={18} className="mr-1.5" />;
      break;
    case "CANCELED":
      statusColorClass = "bg-red-100 text-red-800";
      statusIcon = <XCircle size={18} className="mr-1.5" />;
      break;
  }

  // ✅ Filter status yang tersedia berdasarkan role
  const availableStatuses = getAvailableStatuses(userRole);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        type="button"
        className={`inline-flex items-center justify-center w-full rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none ${statusColorClass}`}
        onClick={() => onToggle(orderId)}
      >
        {statusIcon}
        {getStatusLabel(currentStatus)}
        <ChevronDown size={16} className="ml-1 -mr-0.5" />
      </button>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-40 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
          role="menu"
        >
          <div className="py-1">
            {/* ✅ Hanya tampilkan status yang diizinkan untuk role user */}
            {availableStatuses.map((status) => (
              <button
                key={status}
                onClick={() => handleSelectStatus(status)}
                className={`${
                  status === currentStatus
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700"
                } group flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900`}
              >
                {getStatusLabel(status)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Komponen utama tanpa pagination
export default function OrderTable({
  order,
  onView,
  onStatusChange,
  onToggleStatusSort,
  statusSortOrder,
}: OrderTableProps) {
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const handleToggleDropdown = (id: number) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-tertiary shadow-lg rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-primary text-white">
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
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700 divide-y divide-gray-200">
            {order.map((item) => (
              <tr key={item.id}>
                <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                  {item.customerName}
                </td>
                <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                  {item.productName}
                </td>
                <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                  {item.partnerName}
                </td>
                <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                  {item.totalQuantity}
                </td>
                <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                  {item.totalPrice}
                </td>
                <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                  <StatusDropdown
                    currentStatus={item.status}
                    orderId={item.id}
                    onStatusChange={onStatusChange}
                    isOpen={openDropdownId === item.id}
                    onToggle={handleToggleDropdown}
                  />
                </td>
                <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                  <button
                    onClick={() => onView(item.id)}
                    className="cursor-pointer p-2 text-white rounded-xl bg-primary hover:-translate-y-1 duration-150 ease-in"
                    title="View"
                  >
                    <Expand size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
