"use client";

import { useEffect, useState } from "react";
import { fetchOrderById } from "@/app/utils/order"; // Pastikan path ini benar
import { formatCurrency, formatDate } from "@/app/utils/helper"; // Pastikan path ini benar
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Import skeleton CSS
import { X } from "lucide-react";

// Interface ini bisa Anda simpan di file terpisah jika digunakan di banyak tempat
interface OrderItem {
  namaProduk: string;
  harga: number;
  quantity: number;
  catatan: string | null;
  namaMitra: string;
}

interface OrderDetails {
  orderId: number;
  tanggalTransaksi: string;
  namaCustomer: string;
  status: string;
  alamatCustomer: string;
  items: OrderItem[];
  totalHarga: number;
}

// Komponen StatusBadge bisa tetap di sini atau dipindah ke file utilitas UI
const StatusBadge = ({ status }: { status: string }) => {
    let bgColor = "bg-gray-400";
    let textColor = "text-white";
    let formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    switch (status.toUpperCase()) {
        case "PENDING":
            bgColor = "bg-yellow-100"; textColor = "text-yellow-800"; break;
        case "SUCCESS":
        case "DIKIRIM":
            bgColor = "bg-green-100"; textColor = "text-green-800"; break;
        case "CANCELED":
            bgColor = "bg-red-100"; textColor = "text-red-800"; break;
    }

    return (
        <span className={`inline-block text-sm font-medium px-4 py-1 rounded-full ${bgColor} ${textColor}`}>
            {formattedStatus}
        </span>
    );
};


// Props untuk Modal
interface OrderDetailModalProps {
  orderId: number | null; // ID pesanan yang akan ditampilkan, null jika tidak ada
  isOpen: boolean;       // Status apakah modal sedang terbuka
  onClose: () => void;   // Fungsi untuk menutup modal
}

export default function OrderDetailModal({ orderId, isOpen, onClose }: OrderDetailModalProps) {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Hanya fetch data jika modal terbuka dan ada orderId yang valid
    if (isOpen && orderId) {
      const getOrderDetails = async () => {
        setIsLoading(true);
        setError(null);
        setOrderDetails(null); // Reset state sebelumnya
        try {
          // Simulate API delay for testing skeleton
          // await new Promise(resolve => setTimeout(resolve, 2000));
          const response = await fetchOrderById(orderId);
          setOrderDetails(response.data);
        } catch (err: any) {
          console.error("Gagal mengambil detail pesanan:", err);
          setError(err.response?.data?.message || err.message || "Terjadi kesalahan.");
        } finally {
          setIsLoading(false);
        }
      };

      getOrderDetails();
    }
  }, [orderId, isOpen]); // Effect ini berjalan setiap kali orderId atau status isOpen berubah

  // Jangan render apa-apa jika modal tidak seharusnya terbuka
  if (!isOpen) {
    return null;
  }

  const ShimmerLoader = () => (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
      <div className="bg-white rounded-xl p-6">
        {/* Header Detail Pesanan - Skeleton */}
        <div className="bg-gray-100 p-6 rounded-lg mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <h2 className="font-medium text-gray-700"><Skeleton width={80} /></h2>
              <p className="text-gray-900 text-lg font-mono"><Skeleton width={100} /></p>
            </div>
            <div>
              <h2 className="font-medium text-gray-700"><Skeleton width={120} /></h2>
              <p className="text-gray-900 text-lg"><Skeleton width={150} /></p>
            </div>
            <div>
              <h2 className="font-medium text-gray-700"><Skeleton width={50} /></h2>
              <p><Skeleton width={100} height={28} style={{ borderRadius: '9999px' }} /></p>
            </div>
          </div>
        </div>

        {/* Alamat Pengiriman - Skeleton */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-3"><Skeleton width={150} /></h2>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="font-medium text-gray-800"><Skeleton width={'60%'} /></p>
            <p className="text-gray-600"><Skeleton width={'80%'} /></p>
          </div>
        </div>

        {/* Rincian Produk - Skeleton */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4"><Skeleton width={120} /></h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-medium text-gray-900 sm:pl-0"><Skeleton width={60} /></th>
                <th className="px-3 py-3.5 text-left text-sm font-medium text-gray-900"><Skeleton width={80} /></th>
                <th className="px-3 py-3.5 text-center text-sm font-medium text-gray-900"><Skeleton width={50} /></th>
                <th className="relative py-3.5 pl-3 pr-4 sm:pr-0 text-right text-sm font-medium text-gray-900"><Skeleton width={70} /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {[...Array(2)].map((_, index) => ( // Display 2 skeleton rows for items
                <tr key={index}>
                   <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                        <div className="font-medium"><Skeleton width={'70%'} /></div>
                        <div className="mt-1 text-xs text-gray-500"><Skeleton width={'50%'} /></div>
                        <div className="mt-1 text-xs text-blue-600"><Skeleton width={'40%'} /></div>
                   </td>
                   <td className="px-3 py-4 text-sm"><Skeleton width={70} /></td>
                   <td className="px-3 py-4 text-sm text-center"><Skeleton width={30} /></td>
                   <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                       <Skeleton width={70} />
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total - Skeleton */}
        <div className="border-t pt-4">
            <div className="text-right">
                <p className="text-md text-gray-600"><Skeleton width={80} /></p>
                <p className="text-lg font-medium text-gray-900"><Skeleton width={100} /></p>
            </div>
        </div>
      </div>
    </SkeletonTheme>
  );


  return (
    // Overlay (latar belakang gelap)
    <div
      className="fixed inset-0 backdrop-blur-lg bg-opacity-50 z-40 flex justify-center items-center p-4" // Changed bg-opacity for better blur visibility
      onClick={onClose} // Menutup modal saat mengklik di luar konten
    >
      {/* Konten Modal */}
      <div
        className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" // Added bg-white here for the modal itself
        onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam konten menutup modal
      >
        {/* Tombol Close di pojok kanan atas */}
        <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white z-10 p-1 bg-primary rounded-full hover:-translate-y-1 duration-150 ease-in" // Added some styling to close button
        >
            <X size={18} />
        </button>

        {/* Konten Detail Pesanan */}
        <div className=""> {/* Removed bg-white from here, moved to parent */}
            {isLoading && <ShimmerLoader />}
            {error && <div className="text-center text-red-600 p-10">Error: {error}</div>}
            {orderDetails && !isLoading && (
              <div className="p-6"> {/* Removed bg-white and rounded-xl from here, already on parent */}
                {/* Header Detail Pesanan */}
                <div className="bg-gray-100 p-6 rounded-lg mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <h2 className="font-medium text-gray-700">No. Pesanan</h2>
                      <p className="text-gray-900 text-lg font-mono">#{orderDetails.orderId}</p>
                    </div>
                    <div>
                      <h2 className="font-medium text-gray-700">Tanggal Transaksi</h2>
                      <p className="text-gray-900 text-lg">{formatDate(orderDetails.tanggalTransaksi)}</p>
                    </div>
                    <div>
                      <h2 className="font-medium text-gray-700">Status</h2>
                      <StatusBadge status={orderDetails.status} />
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-lg font-medium mb-3">Alamat Pengiriman</h2>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="font-medium text-gray-800">{orderDetails.namaCustomer}</p>
                    <p className="text-gray-600">{orderDetails.alamatCustomer}</p>
                  </div>
                </div>

                <div className="mb-6"> {/* Adjusted margin bottom */}
                  <h3 className="text-lg font-medium mb-4">Rincian Produk</h3>
                  <div className="overflow-x-auto"> {/* Added for better responsiveness on small screens */}
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="py-3.5 pl-4 pr-3 text-left text-sm font-medium text-gray-900 sm:pl-0">Produk</th>
                          <th className="hidden sm:table-cell px-3 py-3.5 text-left text-sm font-medium text-gray-900">Harga Satuan</th>
                          <th className="hidden sm:table-cell px-3 py-3.5 text-center text-sm font-medium text-gray-900">Jumlah</th>
                          <th className="py-3.5 pl-3 pr-4 text-right text-sm font-medium text-gray-900 sm:pr-0">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {orderDetails.items.map((item, index) => (
                          <tr key={index}>
                             <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                                  <div className="font-medium">{item.namaProduk}</div>
                                  <div className="mt-1 text-xs text-gray-500 sm:hidden">
                                    {formatCurrency(item.harga)} x {item.quantity}
                                  </div>
                                  <div className="mt-1 text-xs text-gray-500">Mitra: {item.namaMitra}</div>
                                  {item.catatan && <div className="mt-1 text-xs text-blue-600">Catatan: {item.catatan}</div>}
                             </td>
                             <td className="hidden sm:table-cell px-3 py-4 text-sm text-gray-500">{formatCurrency(item.harga)}</td>
                             <td className="hidden sm:table-cell px-3 py-4 text-sm text-center text-gray-500">{item.quantity}</td>
                             <td className="py-4 pl-3 pr-4 text-right text-sm font-medium text-gray-900 sm:pr-0">
                                 {formatCurrency(item.harga * item.quantity)}
                             </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-4 mt-6"> {/* Added border-gray-200 and mt-6 */}
                    <div className="text-right">
                        <p className="text-sm text-gray-600">Total Harga:</p>
                        <p className="text-lg font-medium text-gray-900">{formatCurrency(orderDetails.totalHarga)}</p> {/* Made total slightly larger */}
                    </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
