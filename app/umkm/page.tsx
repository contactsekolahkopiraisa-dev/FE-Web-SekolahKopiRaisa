// app\umkm\page.tsx
"use client";

import { CalendarCheck, Building, Store } from "lucide-react";
import ProductTable from "../../components/product/ProductTable";
import { useEffect, useState } from "react";
import { fetchAllActivity } from "../utils/activity";
import { fetchAllProduct } from "../utils/product";
import { fetchAllPartner } from "../utils/partner";
import { fetchAllUMKMOrder } from "../utils/order-umkm";
import { getUserId } from "../utils/auth"; // Import helper function
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { UserItem } from "../types/userType";
import { getUser } from "../utils/user";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function UmkmDashboard() {
  const [user, setUser] = useState<UserItem | null>(null);
  const [counstProduct, setCountProduct] = useState(0);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProductCount = async () => {
    try {
      setLoading(true);

      // Dapatkan user_id dari user yang sedang login
      const currentUserId = getUserId();

      // Validasi jika user_id tidak ditemukan
      if (currentUserId === null) {
        setError("User ID tidak ditemukan. Silakan login kembali.");
        setLoading(false);
        return;
      }

      const response = await fetchAllProduct();
      console.log("Full API response:", response);
      const rawData = response.data;
      console.log("Raw product data:", rawData);

      if (!Array.isArray(rawData)) {
        console.error("Expected array but got:", typeof rawData, rawData);
        setError("Data produk tidak valid.");
        setLoading(false);
        return;
      }

      // Filter produk berdasarkan partner.user_id
      const filteredProducts = rawData.filter(
        (item: any) => item.partner?.user_id === currentUserId
      );

      console.log(
        "Filtered products for user_id",
        currentUserId,
        ":",
        filteredProducts
      );

      setCountProduct(filteredProducts.length);

      // Get recent products (last 3) dari data yang sudah difilter
      if (filteredProducts.length > 0) {
        const sortedProducts = filteredProducts
          .sort(
            (a: any, b: any) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .slice(0, 3);
        setRecentProducts(sortedProducts);
      } else {
        setRecentProducts([]);
      }

      console.log("Product count:", filteredProducts.length);
      console.log("Recent products:", filteredProducts.slice(0, 3));
    } catch (error) {
      console.error("Error fetching product count:", error);
      setError("Gagal memuat data produk. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductCount();
  }, []);

  // New function to fetch recent orders
  const fetchRecentOrders = async () => {
    try {
      const response = await fetchAllUMKMOrder();
      const orders = response.data;

      if (Array.isArray(orders)) {
        const processedOrders = orders.map((order: any) => ({
          id: order.id,
          customer_name: order.user?.name || "N/A",
          total: order.payment?.amount || 0,
          created_at: order.created_at,
          status: order.status?.toLowerCase() || "pending",
        }));

        const sortedOrders = processedOrders
          .sort(
            (a: any, b: any) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .slice(0, 3);

        setRecentOrders(sortedOrders);
      }
    } catch (error) {
      console.error("Error fetching recent orders:", error);
      // Fallback to empty array on error
      setRecentOrders([]);
    }
  };

  useEffect(() => {
    fetchRecentOrders();
  }, []);

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

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Hari ini";
    if (diffInDays === 1) return "1 hari lalu";
    if (diffInDays < 7) return `${diffInDays} hari lalu`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} minggu lalu`;
    return `${Math.floor(diffInDays / 30)} bulan lalu`;
  };

  return (
    <main className="container mx-auto">
      {/* Greeting */}
      <h1 className="text-lg font-medium mb-1">{user?.name}</h1>
      <p className="text-gray-600 mb-8">
        Ini adalah ringkasan dashboardmu hari ini.
      </p>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Statistik Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<Store size={28} className="text-orange-500" />}
          title="Total Produk"
          value={loading ? "..." : counstProduct.toString()}
        />
      </div>

      {/* Konten Terbaru */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Produk Terbaru */}
        <div className="bg-tertiary p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-medium mb-4 text-gray-800">
            Produk Terbaru
          </h2>
          <div className="space-y-0">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 animate-pulse ${
                    index !== 2 ? "border-b border-gray-200" : ""
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-gray-200 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : recentProducts.length > 0 ? (
              recentProducts.map((product: any, index: number) => (
                <div
                  key={product.id || index}
                  className={`flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors ${
                    index !== recentProducts.length - 1
                      ? "border-b border-gray-200"
                      : ""
                  }`}
                >
                  {/* Product Image */}
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0 shadow-sm">
                    {product.image ? (
                      <img
                        src={product.image || "/placeholder-product.jpg"}
                        alt={product.name || "Product"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder-product.jpg";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-orange-100 flex items-center justify-center">
                        <Store size={20} className="text-orange-500" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate text-gray-800 mb-1">
                      {product.name || `Produk ${index + 1}`}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 flex items-center">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                        {formatTimeAgo(product.created_at)}
                      </p>
                      {product.price && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          Rp {product.price.toLocaleString("id-ID")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-gray-400 text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                  <Store size={24} className="text-gray-300" />
                </div>
                <p className="text-sm">Belum ada produk</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Terbaru */}
        <div className="bg-tertiary p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-medium mb-4 text-gray-800">
            Order Terbaru
          </h2>
          <div className="space-y-0">
            {recentOrders.length > 0 ? (
              recentOrders.map((order: any, index: number) => (
                <div
                  key={order.id || index}
                  className={`flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors ${
                    index !== recentOrders.length - 1
                      ? "border-b border-gray-200"
                      : ""
                  }`}
                >
                  {/* Customer Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium text-sm flex-shrink-0 shadow-sm">
                    {order.customer_name
                      ? order.customer_name.charAt(0).toUpperCase()
                      : "C"}
                  </div>

                  {/* Order Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm truncate text-gray-800">
                        {order.customer_name || `Customer ${index + 1}`}
                      </p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.status === "processing"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "shipped"
                            ? "bg-purple-100 text-purple-700"
                            : order.status === "delivered"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.status === "pending"
                          ? "Menunggu"
                          : order.status === "processing"
                          ? "Diproses"
                          : order.status === "shipped"
                          ? "Dikirim"
                          : order.status === "delivered"
                          ? "Selesai"
                          : order.status || "Unknown"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        {formatTimeAgo(order.created_at)}
                      </p>
                      <p className="text-xs font-semibold text-green-600">
                        Rp {order.total?.toLocaleString("id-ID") || "0"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-gray-400 text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                  <Building size={24} className="text-gray-300" />
                </div>
                <p className="text-sm">Belum ada order</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div></div>
    </main>
  );
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="bg-tertiary p-6 rounded-xl shadow-lg flex items-center gap-4">
      <div className="bg-gray-100 p-3 rounded-full">{icon}</div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-lg font-medium">{value}</p>
      </div>
    </div>
  );
}
