// components/OrderCard.tsx
"use client";

import { formatCurrency } from "../../app/utils/helper";
import { 
  Package, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  Truck, 
  XCircle,
  Hash,
  Store,
  ExternalLink
} from "lucide-react";

export interface OrderItem {
  productId: number;
  name: string;
  productImage: string;
  quantity: number;
  price: number;
  subtotal: number;
  partner: {
    id: number;
    name: string;
  };
  note: string;
}

interface Order {
  orderId: number;
  statusOrder: string;
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

interface Props {
  order: Order;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    // case "PENDING":
    //   return {
    //     style: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300",
    //     label: "Dibuat",
    //     icon: Clock,
    //   };
    case "PROCESSING":
      return {
        style: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300",
        label: "Diproses",
        icon: Package,
      };
    case "SHIPPED":
      return {
        style: "bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 border border-indigo-300",
        label: "Dikirim",
        icon: Truck,
      };
    case "DELIVERED":
      return {
        style: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300",
        label: "Diterima",
        icon: CheckCircle,
      };
    case "CANCELED":
      return {
        style: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300",
        label: "Dibatalkan",
        icon: XCircle,
      };
    default:
      return {
        style: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300",
        label: status,
        icon: Package,
      };
  }
};

export default function OrderCard({ order }: Props) {
  const badge = getStatusBadge(order.statusOrder);
  const StatusIcon = badge.icon;

  const handlePaymentClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    if (order.payment.snapRedirectUrl) {
      window.open(order.payment.snapRedirectUrl, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden group">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Hash className="w-4 h-4 text-gray-400" />
              <p className="text-sm text-gray-600">
                ID Pesanan: <span className="font-medium text-gray-800">{order.orderId}</span>
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString("id-ID", {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${badge.style}`}>
            <StatusIcon size={16} />
            <span>{badge.label}</span>
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="p-6">
        <div className="space-y-4">
          {order.items.slice(0, 2).map((item, index) => (
            <div key={index} className="flex items-start space-x-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="relative">
                <img
                  src={item.productImage}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-sm"
                />
                <div className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {item.quantity}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <h4 className="font-medium text-gray-800 truncate mb-1">{item.name}</h4>
                    <div className="flex items-center space-x-1 mb-2">
                      <Store className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-500">{item.partner.name}</p>
                    </div>
                    {item.note && (
                      <p className="text-xs text-gray-400 bg-white px-2 py-1 rounded-md">
                        Catatan: {item.note}
                      </p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm text-gray-600">
                      {item.quantity} × {formatCurrency(item.price)}
                    </p>
                    <p className="font-medium text-gray-800">
                      {formatCurrency(item.subtotal)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Show more items indicator */}
          {order.items.length > 2 && (
            <div className="text-center py-2">
              <p className="text-sm text-gray-500 bg-gray-100 rounded-lg py-2 px-4 inline-block">
                +{order.items.length - 2} produk lainnya
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600 line-clamp-2">{order.shippingAddress}</p>
            </div>
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-gray-400" />
              <p className="text-sm text-gray-600">
                {order.payment.method.replace("_", " ")} 
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  order.payment.statusPembayaran === 'SUCCESS' 
                    ? 'bg-green-100 text-green-700' 
                    : order.payment.statusPembayaran === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-700'
                    : order.payment.statusPembayaran === 'EXPIRE'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {order.payment.statusPembayaran === "SUCCESS" ? "Berhasil" : 
                   order.payment.statusPembayaran === "PENDING" ? "Menunggu" :
                   order.payment.statusPembayaran === "EXPIRE" ? "Kadaluarsa" : 
                   order.payment.statusPembayaran}
                </span>
              </p>
            </div>
          </div>
          
          <div className="text-right">
  <p className="text-sm text-gray-500 mb-1">Total Pembayaran</p>
  <p className="text-lg font-medium text-primary">
    {formatCurrency(order.payment.amount)}
  </p>
  
  {/* Tombol Bayar jika pembayaran pending dan ada snapRedirectUrl */}
  {order.payment.statusPembayaran === "PROCESS" && order.payment.snapRedirectUrl && (
    <div className="flex justify-end mt-2">
      <button
        onClick={handlePaymentClick}
        className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors"
      >
        <CreditCard size={16} />
        <span>Bayar Sekarang</span>
        <ExternalLink size={14} />
      </button>
    </div>
  )}
</div>
        </div>
      </div>

      {/* Hover effect indicator */}
      <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
}
