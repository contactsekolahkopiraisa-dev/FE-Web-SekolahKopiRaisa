import {
  Loader,
  CheckCircle,
  XCircle,
  Expand,
} from "lucide-react";

// 1. Hapus 'onView' dari interface Product
interface Product  {
  name: string;
  id: string;
  category: string;
  qty: number;
  amount: string;
  status: "Pending" | "Success" | "Canceled";
  // onView?: (id: string) => void; <-- Hapus baris ini
};

// Definisikan props untuk ProductTable secara terpisah agar lebih rapi
interface ProductTableProps {
  product: Product[];
  onView: (id: string) => void; // Tambahkan prop onView di sini
}

// 2. Terima 'product' dan 'onView' sebagai props
export default function ProductTable({ product, onView }: ProductTableProps) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 text-sm text-gray-700">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Nama Customer</th>
            <th className="px-4 py-3 text-left font-medium">Nama Produk</th>
            {/* Urutan kolom disesuaikan dengan isi tabel */}
            <th className="px-4 py-3 text-left font-medium">Quantity Total</th>
            <th className="px-4 py-3 text-left font-medium">Total Harga</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-700 divide-y divide-gray-200">
          {product.map((item, idx) => (
            <tr key={idx}>
              <td className="px-4 py-3">
                <div className="font-medium text-gray-900">{item.name}</div>
                <div className="text-xs text-gray-500">{item.id}</div>
              </td>
              <td className="px-4 py-3">{item.category}</td>
              <td className="px-4 py-3">{item.qty}</td>
              <td className="px-4 py-3">{item.amount}</td>
              <td className="px-4 py-3">
                <StatusBadge status={item.status} />
              </td>
              <td className="px-4 py-3">
              {/* Sekarang 'onView' sudah terdefinisi dan bisa dipanggil */}
              <button
                onClick={() => onView(item.id)} // Tidak perlu optional chaining (?) jika onView wajib ada
                className="cursor-pointer p-2 text-white rounded-xl bg-blue-500 hover:-translate-y-1 duration-150 ease-in"
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
  );
}

// Komponen StatusBadge tidak perlu diubah
function StatusBadge({ status }: { status: string }) {
  let style = "";
  let icon = null;

  switch (status) {
    case "Pending":
      style = "bg-yellow-100 text-yellow-800";
      icon = <Loader size={14} className="animate-spin mr-1" />;
      break;
    case "Success":
      style = "bg-green-100 text-green-800";
      icon = <CheckCircle size={14} className="mr-1" />;
      break;
    case "Canceled":
      style = "bg-red-100 text-red-800";
      icon = <XCircle size={14} className="mr-1" />;
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${style}`}
    >
      {icon}
      {status}
    </span>
  );
}