"use client";

import React from "react";
import { formatCurrency } from "../../app/utils/helper";
import { ProductItem } from "../../app/types/productType";

export default function ProductCard({
  id,
  image,
  name,
  price,
  sold,
  onView,
}: ProductItem) {
  return (
    <div
      className="w-full bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 ease-out flex flex-col group cursor-pointer border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1"
      onClick={() => onView?.(id ?? 0)}
    >
      {/* Gambar Produk */}
      <div className="w-full aspect-[4/3] overflow-hidden relative bg-gray-50">
        <img
          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-105"
          src={image}
          alt={name}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/320x240?text=Image+Not+Found";
          }}
        />
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
      </div>

      {/* Detail Produk */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow bg-gradient-to-b from-white to-gray-50/30">
        <h3
          className="text-lg font-medium text-gray-800 mb-2 line-clamp-2 group-hover:text-gray-900 transition-colors duration-300 leading-tight"
          title={name}
        >
          {name}
        </h3>

        <div className="mt-auto space-y-3">
          {/* Sold information with better styling */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-sm text-gray-600 font-medium">
              {(sold ?? 0).toLocaleString("id-ID")} terjual
            </p>
          </div>

          {/* Price with enhanced styling */}
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium text-gray-900 group-hover:text-primary transition-colors duration-300">
              {formatCurrency(price ?? 0)}
            </p>
            <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
