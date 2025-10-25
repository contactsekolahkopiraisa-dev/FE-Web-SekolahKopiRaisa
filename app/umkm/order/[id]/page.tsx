"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchOrderById } from "@/app/utils/order";
import { formatCurrency } from "@/app/utils/helper";

interface OrderItem {
  namaProduk: string;
  harga: number;
  quantity: number;
  catatan: string;
  namaMitra: string;
}

interface OrderData {
  orderId: number;
  namaCustomer: string;
  alamatCustomer: string;
  tanggalTransaksi: string;
  statusOrder: string;
  items: OrderItem[];
  statusPembayaran: string;
  totalHarga: number;
  kodePos: number;
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const res = await fetchOrderById(Number(id));
        setOrder(res.data);
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadOrder();
  }, [id]);

  if (loading) return <div className="p-6">Memuat data...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!order) return <div className="p-6">Data tidak ditemukan.</div>;

  const totalQuantity = order.items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-[#fcfbf8] p-6">
      {/* Header */}
      <div className="bg-[#e0d6cc] rounded-md p-6 mb-6">
        <h2 className="font-bold text-lg mb-1">No. Pesanan</h2>
        <p className="mb-2">{order.orderId}</p>
        <h2 className="font-bold text-lg mb-1">Tanggal Transaksi</h2>
        <p className="mb-2">
          {new Date(order.tanggalTransaksi).toLocaleDateString("id-ID")}
        </p>
        <h2 className="font-bold text-lg mb-1">Status</h2>
        <button className="bg-blue-500 text-white rounded-full px-4 py-1 text-sm">
          {order.statusOrder}
        </button>
      </div>

      {/* Alamat */}
      <div className="mb-4">
        <h3 className="font-bold text-lg">Customer</h3>
        <p className="font-semibold">{order.namaCustomer}</p>
        <p>{order.alamatCustomer}, {order.kodePos}</p>
      </div>

      {/* Tabel Produk */}
      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <div className="grid grid-cols-4 font-semibold p-4 border-b text-sm">
          <span>Produk dipesan</span>
          <span>Harga satuan</span>
          <span>Jumlah</span>
          <span>Sub total produk</span>
        </div>

        {order.items.map((item, i) => (
          <div key={i} className="grid grid-cols-4 items-center p-4 border-b">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">{item.namaProduk}</p>
              <p className="text-xs text-gray-500">Mitra: {item.namaMitra}</p>
            </div>
            <p>{formatCurrency(item.harga)}</p>
            <p>{item.quantity}</p>
            <p className="font-bold">
              {formatCurrency(item.harga * item.quantity)}
            </p>
          </div>
        ))}

        {/* Catatan & Total */}
        <div className="p-4 border-t grid grid-cols-2 items-center gap-4">
          <input
            type="text"
            placeholder="Catatan"
            disabled
            className="border rounded-md px-4 py-2 w-full text-sm"
          />
          <div className="text-right text-sm">
            <p>
              Total Pesanan ({totalQuantity} produk):{" "}
              <span className="font-bold text-lg">
                {formatCurrency(order.totalHarga)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
