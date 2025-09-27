import { Pencil, SquarePen, Trash } from "lucide-react";
import { formatCurrency } from "../utils/helper";
import { ProductItem } from "../types/productType";



export default function ProductListAdmin({
  id,
  name,
  image,
  price,
  stock,
  weight,
  sold,
  partner,
  onView,
  onEdit,
  onDelete
}: ProductItem) {
  return (
    <div className="cursor-pointer rounded-xl overflow-hidden shadow-lg border border-gray-300 p-3 flex flex-col justify-between bg-tertiary relative">
      {/* Availability Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span
          className={`px-2 py-1 rounded-xl text-xs ${
            (stock ?? 0) > 0
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {(stock ?? 0) > 0 ? "Tersedia" : "Habis"}
        </span>
      </div>

      <img src={image} alt={name} className="h-50 object-cover rounded-xl" />

      <div className="mt-3 flex flex-col justify-between flex-grow text-sm">
        <div onClick={() => onView?.(id ?? 0)} className="cursor-pointer">
          <div className="flex justify-between items-start">
            {/* Kolom Kiri */}
            <div className="flex flex-col space-y-1">
              <h2 className="font-medium text-black leading-snug">{name}</h2>
              <p className="font-medium text-primary">
                {formatCurrency(Number(price))}
              </p>
              <p className="text-gray-600 text-xs">Mitra: {partner?.name}</p>
            </div>

            {/* Kolom Kanan */}
            <div className="flex flex-col space-y-1 text-right">
              <p className="text-gray-600 text-xs">Berat: {weight}g</p>
              <p className="text-gray-500">Stok: {stock}</p>
              <p className="text-gray-600 text-xs">Terjual: {sold}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end md:items-center space-x-2 mt-3 md:mt-0">
          {/* Edit */}
          <button
            onClick={() => onEdit?.(id ?? 0)}
            className="cursor-pointer p-2 text-white rounded-xl bg-blue-500 hover:-translate-y-1 duration-150 ease-in"
            title="Edit"
          >
            <SquarePen size={18} />
          </button>
          {/* Delete */}
          <button
            onClick={() => onDelete?.(id ?? 0)}
            className="cursor-pointer p-2 text-white rounded-xl bg-red-500 hover:-translate-y-1 duration-150 ease-in"
            title="Hapus"
          >
            <Trash size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
