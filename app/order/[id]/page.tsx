"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  cancelOrder,
  fetchMyOrder,
  fetchOrderById,
  updateStatusOrder,
} from "@/app/utils/order";
import { UserItem } from "@/app/types/userType";
import Popup from "@/components/Popup";
import ConfirmModal from "@/components/ConfirmModal";
import ReasonModal from "@/components/ReasonModal";
import {
  ArrowLeft,
  Package,
  Calendar,
  MapPin,
  CreditCard,
  Phone,
  User,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";

interface OrderData {
  orderId: number;
  namaCustomer: string;
  nomerCustomer: string;
  alamatCustomer: string;
  tanggalTransaksi: string;
  statusOrder: string;
  items: {
    namaProduk: string;
    harga: number;
    quantity: number;
    catatan: string;
    namaMitra: string;
    gambarProduk: string;
  }[];
  metodePembayaran: string;
  statusPembayaran: string;
  totalHarga: number;
  kodePos: number;
}

export default function OrderDetailPage() {
  // const { id } = useParams();
  const id = Number(useParams().id);
  // const params = useParams();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error">("success");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [reportCencelOrder, setReportCencelOrder] = useState<number | null>(
    null
  );
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showConfirmModalShipped, setShowConfirmModalShipped] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        const orderData = await fetchOrderById(id);
        console.log("Fetched order data:", orderData);

        if (!orderData) {
          throw new Error("Pesanan tidak ditemukan");
        }

        // Format order data if necessary
        const formattedOrder: OrderData = {
          orderId: orderData.data.orderId,
          namaCustomer: orderData.data.namaCustomer || "Tidak Diketahui",
          nomerCustomer: orderData.data.nomerCustomer || "Tidak Diketahui",
          alamatCustomer: orderData.data.alamatCustomer || "Tidak Diketahui",
          tanggalTransaksi: new Date(
            orderData.data.tanggalTransaksi
          ).toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          statusOrder: orderData.data.statusOrder,
          items: orderData.data.items
            ? orderData.data.items.map((item: any) => ({
                namaProduk: item.namaProduk || "Tidak Diketahui",
                harga: item.harga || 0,
                quantity: item.quantity || 1,
                catatan: item.catatan || "",
                namaMitra: item.namaMitra || "Tidak Diketahui",
                gambarProduk: item.gambarProduk || "",
              }))
            : [],
          metodePembayaran: orderData.data.metodePembayaran,
          statusPembayaran: orderData.data.statusPembayaran,
          totalHarga: orderData.data.totalHarga,
          kodePos: orderData.data.kodePos,
        };

        // Set the formatted order data
        setOrder(formattedOrder);
        setError(null);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderData();
    }
  }, [id]);

  const handleCancelOrder = async () => {
    if (!order) return;

    try {
      setLoading(true);
      const response = await cancelOrder(order.orderId, cancelReason);

      if (response.success) {
        setMessage("Pesanan berhasil dibatalkan");
        setPopupType("success");
        setShowPopup(true);
        router.push("/order");
      } else {
        throw new Error(response.message || "Gagal membatalkan pesanan");
      }
    } catch (err) {
      console.error("Error cancelling order:", err);
      setMessage(err instanceof Error ? err.message : "An error occurred");
      setPopupType("error");
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const handleFinishOrder = async () => {
    if (!order) return;

    try {
      setLoading(true);
      const response = await updateStatusOrder(order.orderId, "DELIVERED");
      if (response.success) {
        setMessage("Pesanan berhasil diselesaikan");
        setPopupType("success");
        setShowPopup(true);
        router.push("/order");
      } else {
        throw new Error(response.message || "Gagal menyelesaikan pesanan");
      }
    } catch (err) {
      console.error("Error finishing order:", err);
      setMessage(err instanceof Error ? err.message : "An error occurred");
      setPopupType("error");
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  // Status timeline component
  const StatusTimeline = ({ status }: { status: string }) => {
    const statuses = [
      // { key: "PENDING", label: "Dibuat", icon: Clock },
      { key: "PROCESSING", label: "Diproses", icon: Package },
      { key: "SHIPPED", label: "Dikirim", icon: Truck },
      { key: "DELIVERED", label: "Diterima", icon: CheckCircle },
    ];

    const currentIndex = statuses.findIndex((s) => s.key === status);
    const isCanceled = status === "CANCELED";

    if (isCanceled) {
      return (
        <div className="flex items-center justify-center p-4 bg-red-50 rounded-xl border border-red-200">
          <XCircle className="w-6 h-6 text-red-500 mr-2" />
          <span className="text-red-700 font-medium">Pesanan Dibatalkan</span>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        {statuses.map((statusItem, index) => {
          const Icon = statusItem.icon;
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={statusItem.key} className="flex items-center flex-1">
              <div
                className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  isActive
                    ? isCurrent
                      ? "bg-primary border-primary text-white shadow-lg"
                      : "bg-green-500 border-green-500 text-white"
                    : "bg-gray-200 border-gray-300 text-gray-400"
                }`}
              >
                <Icon size={20} />
                {isCurrent && (
                  <div className="absolute -inset-1 bg-primary rounded-full animate-pulse opacity-20"></div>
                )}
              </div>
              <div className="ml-3 flex-1">
                <p
                  className={`text-sm font-medium ${
                    isActive ? "text-gray-800" : "text-gray-400"
                  }`}
                >
                  {statusItem.label}
                </p>
              </div>
              {index < statuses.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-4 ${
                    index < currentIndex ? "bg-green-500" : "bg-gray-300"
                  }`}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-6 animate-pulse">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
      {[...Array(3)].map((_, index) => (
        <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24">
        <div className="container mx-auto px-4">
          <LoadingSkeleton />
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 text-center shadow-lg max-w-md mx-auto">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-gray-800 mb-2">
            Terjadi Kesalahan
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/order")}
            className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
          >
            Kembali ke Pesanan
          </button>
        </div>
      </div>
    );

  if (!order)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 text-center shadow-lg max-w-md mx-auto">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-gray-800 mb-2">
            Pesanan Tidak Ditemukan
          </h2>
          <p className="text-gray-600 mb-6">
            Pesanan yang Anda cari tidak dapat ditemukan
          </p>
          <button
            onClick={() => router.push("/order")}
            className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
          >
            Kembali ke Pesanan
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-secondary">
      {showPopup && (
        <Popup
          message={message}
          type={popupType}
          onClose={() => setShowPopup(false)}
        />
      )}
      <ReasonModal
        isOpen={showReasonModal}
        onClose={() => setShowReasonModal(false)}
        onSubmit={(reason) => {
          setCancelReason(reason);
          setShowReasonModal(false);
          setShowConfirmModal(true);
          setReportCencelOrder(order.orderId);
        }}
      />
      <ConfirmModal
        title="Batalkan Pesanan"
        description={`Apakah Anda yakin ingin membatalkan pesanan ini?\nAlasan: ${cancelReason}`}
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setReportCencelOrder(null);
          setCancelReason("");
        }}
        onConfirm={() => {
          if (reportCencelOrder !== null) {
            handleCancelOrder();
          }
          setShowConfirmModal(false);
          setReportCencelOrder(null);
          setCancelReason("");
        }}
      />
      <ConfirmModal
        title="Konfirmasi Penerimaan"
        description="Apakah Anda yakin ingin menyekesaikan pesanan ini?"
        isOpen={showConfirmModalShipped}
        onClose={() => setShowConfirmModalShipped(false)}
        onConfirm={() => {
          handleFinishOrder();
          setShowConfirmModalShipped(false);
          router.push("/order");
        }}
      />

      <div className="pt-24 pb-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header with Breadcrumb */}
          <div className="mb-8">
            <button
              onClick={() => router.push("/order")}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
            >
              <ChevronLeft size={18} />
              Kembali ke Pesanan
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-medium text-gray-800 mb-2">
                  Detail Pesanan
                </h1>
                <p className="text-gray-600">No. Pesanan: #{order.orderId}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Tanggal Pesanan</p>
                <p className="text-lg font-medium text-gray-800">
                  {new Date(order.tanggalTransaksi).toLocaleDateString(
                    "id-ID",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="mb-8">
            <StatusTimeline status={order.statusOrder} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <MapPin className="w-5 h-5 text-primary mr-2" />
                  <h3 className="text-lg font-medium text-gray-800">
                    Alamat Pengiriman
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="font-medium text-gray-800">
                        {order.namaCustomer}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">
                        {order.nomerCustomer}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 leading-relaxed">
                      {order.alamatCustomer}, {order.kodePos}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Payment Method */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full ">
                <div className="flex items-center mb-4">
                  <CreditCard className="w-5 h-5 text-primary mr-2" />
                  <h3 className="text-lg font-medium text-gray-800">
                    Metode Pembayaran
                  </h3>
                </div>
                  <div
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                      order.metodePembayaran === "BANK_TRANSFER"
                        ? "bg-blue-100 text-blue-800"
                        : order.metodePembayaran === "QRIS"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.metodePembayaran.replace("_", " ")}
                  </div>
              </div>
            </div>
          </div>

          {/* Order Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Products Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center">
                    <Package className="w-5 h-5 text-primary mr-2" />
                    <h3 className="text-lg font-medium text-gray-800">
                      Detail Produk
                    </h3>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <img
                            src={item.gambarProduk}
                            alt={item.namaProduk}
                            className="w-20 h-20 object-cover rounded-xl border border-gray-200"
                          />
                          {/* <div className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium">
                            {item.quantity}
                          </div> */}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 mb-1">
                            {item.namaProduk}
                          </h4>
                          <div className="flex item-center justify-between">
                            <span className="text-gray-500 text-sm">
                              Qty: {item.quantity}
                            </span>
                            <span>
                              {item.catatan && (
                                <p className="text-sm text-gray-400">
                                  Catatan: {item.catatan}
                                </p>
                              )}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-primary font-medium">
                              Rp {item.harga.toLocaleString("id-ID")}
                            </span>
                            <span className="font-medium text-gray-800">
                              Rp{" "}
                              {(item.harga * item.quantity).toLocaleString(
                                "id-ID"
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="space-y-6">
              {/* Payment Summary */}
              <div className="bg-primary rounded-2xl p-6 border border-primary/20 text-white">
                <h3 className="text-lg font-medium  mb-4">
                  Ringkasan Pembayaran
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center ">
                    <span>Subtotal Produk</span>
                    <span>
                      Rp{" "}
                      {order.items
                        .reduce(
                          (acc, item) => acc + item.harga * item.quantity,
                          0
                        )
                        .toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center ">
                    <span>Biaya Pengiriman</span>
                    {/* pengurangan dari total harga dan subtotal produk */}
                    <span>
                      Rp{" "}
                      {(
                        order.totalHarga -
                        order.items.reduce(
                          (acc, item) => acc + item.harga * item.quantity,
                          0
                        )
                      ).toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="h-px bg-gray-200"></div>
                  <div className="flex justify-between items-center text-lg font-medium ">
                    <span>Total Pembayaran</span>
                    <span className="">
                      Rp {order.totalHarga.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {order.statusOrder === "PENDING" && (
                <button
                  onClick={() => setShowReasonModal(true)}
                  className="w-full px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <XCircle className="w-5 h-5" />
                  <span>Batalkan Pesanan</span>
                </button>
              )}

              {order.statusOrder === "SHIPPED" && (
                <button
                  onClick={() => setShowConfirmModalShipped(true)}
                  className="w-full px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Konfirmasi Penerimaan</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
