"use client";

import { CalendarCheck, Building, Store } from "lucide-react";
import ProductTable from "../../components/product/ProductTable";
import { useEffect, useState } from "react";
import { fetchAllActivity } from "../utils/activity";
import { fetchAllProduct } from "../utils/product";
import { fetchAllPartner } from "../utils/partner";
import { fetchAllOrder } from "../utils/order";
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

export default function Dashboard() {
  const [user, setUser] = useState<UserItem | null>(null);
  const [countActivity, setCountActivity] = useState(0);
  const [counstProduct, setCountProduct] = useState(0);
  const [countPartner, setCountPartner] = useState(0);

  // New state for recent data
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  // New state for chart data
  const [weeklyActivityData, setWeeklyActivityData] = useState<any>({
    labels: [],
    datasets: [],
  });

  const fetchActivityCount = async () => {
    try {
      const response = await fetchAllActivity();
      const rawData = response.data;
      const imageMediaCount = rawData.reduce((total: number, item: any) => {
        const imageCount =
          item.newsMedia?.filter((media: any) =>
            media.media_type?.startsWith("image/")
          ).length || 0;
        return total + imageCount;
      }, 0);

      setCountActivity(imageMediaCount);

      // Get recent activities (last 3)
      const sortedActivities = rawData
        .sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 3);
      setRecentActivities(sortedActivities);

      // Prepare weekly activity data for chart
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split("T")[0];
      }).reverse();

      const activityCounts = last7Days.map((date) => {
        return rawData.filter((activity: any) =>
          activity.created_at?.startsWith(date)
        ).length;
      });

      const dayNames = last7Days.map((date) => {
        const dayName = new Date(date).toLocaleDateString("id-ID", {
          weekday: "short",
        });
        return dayName;
      });

      setWeeklyActivityData({
        labels: dayNames,
        datasets: [
          {
            label: "Kegiatan per Hari",
            data: activityCounts,
            backgroundColor: "rgba(59, 130, 246, 0.5)",
            borderColor: "rgba(59, 130, 246, 1)",
            borderWidth: 2,
            fill: true,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching activity count:", error);
    }
  };

  useEffect(() => {
    fetchActivityCount();
  }, []);

  const fetchProductCount = async () => {
    try {
      const response = await fetchAllProduct();
      const products = response.data;
      setCountProduct(Array.isArray(products) ? products.length : 0);

      // Get recent products (last 3)
      if (Array.isArray(products)) {
        const sortedProducts = products
          .sort(
            (a: any, b: any) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .slice(0, 3);
        setRecentProducts(sortedProducts);
      }

    } catch (error) {
      console.error("Error fetching product count:", error);
    }
  };

  useEffect(() => {
    fetchProductCount();
  }, []);

  const fetchPartnerCount = async () => {
    try {
      const response = await fetchAllPartner();
      const partners = response.data;
      setCountPartner(Array.isArray(partners) ? partners.length : 0);
    } catch (error) {
      console.error("Error fetching partner count:", error);
    }
  };

  useEffect(() => {
    fetchPartnerCount();
  }, []);

  // New function to fetch recent orders
  const fetchRecentOrders = async () => {
    try {
      const response = await fetchAllOrder();
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

  // Chart options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  // Doughnut chart data for overview
  const overviewChartData = {
    labels: ["Kegiatan", "Mitra", "Produk"],
    datasets: [
      {
        label: "Total",
        data: [countActivity, countPartner, counstProduct],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(249, 115, 22, 0.8)",
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(34, 197, 94, 1)",
          "rgba(249, 115, 22, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  return (
    <main className="container mx-auto">
      {/* Greeting */}
      <h1 className="text-lg font-medium mb-1">{user?.name}</h1>
      <p className="text-gray-600 mb-8">
        Ini adalah ringkasan dashboardmu hari ini.
      </p>

      {/* Statistik Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<CalendarCheck size={28} className="text-blue-500" />}
          title="Total Kegiatan"
          value={countActivity.toString()}
        />
        <StatCard
          icon={<Building size={28} className="text-green-500" />}
          title="Total Mitra"
          value={countPartner.toString()}
        />
        <StatCard
          icon={<Store size={28} className="text-orange-500" />}
          title="Total Produk"
          value={counstProduct.toString()}
        />
      </div>

      {/* Grafik dan Konten Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Grafik Aktivitas Mingguan */}
        <div className="bg-tertiary p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-medium mb-4">
            Aktivitas 7 Hari Terakhir
          </h2>
          <div className="h-64">
            <Line data={weeklyActivityData} options={barChartOptions} />
          </div>
        </div>

        {/* Grafik Overview */}
        <div className="bg-tertiary p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-medium mb-4">Ringkasan Data</h2>
          <div className="h-64">
            <Doughnut data={overviewChartData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Konten Terbaru */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Kegiatan Terbaru */}
        <div className="bg-tertiary p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-medium mb-4 text-gray-800">
            Kegiatan Terbaru
          </h2>
          <div className="space-y-0">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity: any, index: number) => (
                <div
                  key={activity.id || index}
                  className={`flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors ${
                    index !== recentActivities.length - 1
                      ? "border-b border-gray-200"
                      : ""
                  }`}
                >
                  {/* Activity Image */}
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0 shadow-sm">
                    {activity.newsMedia && activity.newsMedia.length > 0 ? (
                      <img
                        src={
                          activity.newsMedia[0].media_url ||
                          "/placeholder-activity.jpg"
                        }
                        alt={activity.title || "Activity"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder-activity.jpg";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                        <CalendarCheck size={20} className="text-blue-500" />
                      </div>
                    )}
                  </div>

                  {/* Activity Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate text-gray-800 mb-1">
                      {activity.title ||
                        activity.name ||
                        `Kegiatan ${index + 1}`}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      {formatTimeAgo(activity.created_at)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-gray-400 text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                  <CalendarCheck size={24} className="text-gray-300" />
                </div>
                <p className="text-sm">Belum ada kegiatan</p>
              </div>
            )}
          </div>
        </div>

        {/* Produk Terbaru */}
        <div className="bg-tertiary p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-medium mb-4 text-gray-800">
            Produk Terbaru
          </h2>
          <div className="space-y-0">
            {recentProducts.length > 0 ? (
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
