import React, { useState, useEffect } from "react";
import { formatCurrency } from "../../app/utils/helper";
import { Trash2 } from "lucide-react";

// Tipe untuk data item dalam keranjang
export interface CartItemData {
  id: number;
  products_id: number; // ID produk yang terkait
  imageUrl: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  selected: boolean;
  customNote?: string; // opsional
  fromCart?: boolean;
  partnerName?: string;
  weight?: number; // berat produk, jika diperlukan
  inventory?: number;
}

// Props untuk komponen CartItem
interface CartItemProps {
  item: CartItemData;
  onQuantityChange: (
    id: number,
    newQuantity: number,
    inventory: number
  ) => void;
  onSelectionChange: (id: number, isSelected: boolean) => void;
  onDelete: (id: number) => void;
}

// Komponen untuk satu item di keranjang
export default function CartCard({
  item,
  onQuantityChange,
  onSelectionChange,
  onDelete,
}: CartItemProps): JSX.Element {
  const handleIncrease = (): void => {
    onQuantityChange(item.id, item.quantity + 1, item.inventory ?? 0);
  };

  const handleDecrease = (): void => {
    if (item.quantity > 1) {
      onQuantityChange(item.id, item.quantity - 1, item.inventory ?? 0);
    }
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onSelectionChange(item.id, e.target.checked);
  };

  const itemTotal: number = item.price * item.quantity;

  return (
    <div className="flex flex-col sm:grid sm:grid-cols-8 lg:grid-cols-13 gap-2 sm:gap-4 items-start sm:items-center py-4 border-b border-gray-100">
      {/* Mobile Layout */}
      <div className="flex w-full sm:hidden">
        {/* Checkbox and Image */}
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={item.selected}
            onChange={handleSelect}
            className="h-4 w-4 mt-1 text-amber-700 border-gray-300 rounded focus:ring-amber-600"
          />
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-14 h-14 object-cover rounded-md border border-gray-200 flex-shrink-0"
            style={{
              backgroundColor: item.imageUrl.includes("Durian")
                ? "#e9f5ee"
                : "#fef9e7",
            }}
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 ml-3">
          <h3 className="text-sm font-medium text-gray-900 mb-1">
            {item.name}
          </h3>
          <p className="text-xs text-gray-500 mb-2">
            Mitra: {item.partnerName}
          </p>
          <div className="text-sm text-gray-700 mb-2">
            {formatCurrency(item.price)}
          </div>

          {/* Quantity and Total */}
          <div className="flex items-center justify-between">
            <div className="flex items-center border border-gray-200 rounded-md bg-secondary overflow-hidden">
              <button
                onClick={handleDecrease}
                className="px-2 py-1 text-gray-700 hover:bg-gray-200 focus:outline-none text-sm"
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span className="w-6 text-center bg-secondary text-sm">
                {item.quantity}
              </span>
              <button
                onClick={handleIncrease}
                className="px-2 py-1 text-gray-700 hover:bg-gray-200 focus:outline-none text-sm"
                disabled={item.quantity >= (item.inventory ?? 0)}
              >
                +
              </button>
            </div>

            <div className="text-sm font-medium text-gray-900">
              {formatCurrency(itemTotal)}
            </div>

            <button
              onClick={() => onDelete(item.products_id)}
              className="cursor-pointer p-2 text-white rounded-lg bg-red-500 hover:-translate-y-1 duration-150 ease-in"
              title="Hapus item"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Tablet and Desktop Layout */}
      {/* Checkbox */}
      <div className="hidden sm:flex col-span-1 justify-center">
        <input
          type="checkbox"
          checked={item.selected}
          onChange={handleSelect}
          className="h-4 w-4 text-amber-700 border-gray-300 rounded focus:ring-amber-600"
        />
      </div>

      {/* Detail Produk */}
      <div className="hidden sm:flex col-span-3 lg:col-span-5 items-center space-x-2 lg:space-x-3">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-12 h-12 lg:w-16 lg:h-16 object-cover rounded-md border border-gray-200 flex-shrink-0"
          style={{
            backgroundColor: item.imageUrl.includes("Durian")
              ? "#e9f5ee"
              : "#fef9e7",
          }}
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-xs lg:text-sm font-medium text-gray-900 truncate">
            {item.name}
          </h3>
          <p className="text-xs text-gray-500 truncate">
            Mitra: {item.partnerName}
          </p>
        </div>
      </div>

      {/* Harga */}
      <div className="hidden sm:block col-span-1 lg:col-span-2 text-center text-xs lg:text-sm text-gray-700">
        {formatCurrency(item.price)}
      </div>

      {/* Kuantitas */}
      <div className="hidden sm:flex col-span-1 lg:col-span-2 justify-center">
        <div className="flex items-center border border-gray-200 rounded-md bg-secondary overflow-hidden">
          <button
            onClick={handleDecrease}
            className="px-2 lg:px-3 py-1 text-gray-700 hover:bg-gray-200 focus:outline-none text-sm"
            disabled={item.quantity <= 1}
          >
            -
          </button>
          <span className="w-6 lg:w-8 text-center bg-secondary text-sm">
            {item.quantity}
          </span>
          <button
            onClick={handleIncrease}
            className="px-2 lg:px-3 py-1 text-gray-700 hover:bg-gray-200 focus:outline-none text-sm"
            disabled={item.quantity >= (item.inventory ?? 0)}
          >
            +
          </button>
        </div>
      </div>

      {/* Total Harga */}
      <div className="hidden sm:block col-span-1 lg:col-span-2 text-right text-xs lg:text-sm font-medium text-gray-900">
        {formatCurrency(itemTotal)}
      </div>

      <div className="hidden sm:flex col-span-1 justify-center">
        <button
          onClick={() => onDelete(item.products_id)}
          className="cursor-pointer p-2 text-white rounded-xl bg-red-500 hover:-translate-y-1 duration-150 ease-in"
          title="Hapus item"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
