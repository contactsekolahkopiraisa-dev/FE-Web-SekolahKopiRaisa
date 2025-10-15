"use client";
import { Clock, User, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ServiceCardProps {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  duration: string;
  target: string;
  route: string;
}

export default function ServiceCard({
  icon,
  title,
  description,
  duration,
  target,
  route
}: ServiceCardProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 p-8 flex flex-col border border-gray-100">
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="text-amber-900">
          {icon}
        </div>
      </div>

      {/* Title (clickable with chevron) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mx-auto mb-3 inline-flex items-center gap-2 text-lg font-semibold text-gray-900 hover:text-amber-800 focus:outline-none"
        aria-label={`Lihat penjelasan ${title}`}
      >
        <span>{title}</span>
        <ChevronRight className="text-gray-400" size={18} />
      </button>

      {/* Description */}
      <p className="text-center text-gray-500 text-sm mb-6 flex-grow">
        {description}
      </p>

      {/* Info Tags */}
      <div className="flex justify-center gap-4 mb-6 text-xs text-gray-500">
        <span className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
          <Clock size={12} />
          {duration}
        </span>
        <span className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
          <User size={12} />
          {target}
        </span>
      </div>

      {/* Action Button */}
      <Link href={route}>
        <button className="w-full bg-amber-800 text-white py-3 px-4 rounded-md font-medium hover:bg-amber-900 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg">
          Ajukan Layanan
        </button>
      </Link>

      {/* Modal - Penjelasan Layanan */}
      {open && mounted && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 md:p-8 shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">{title}</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Tutup"
              >
                <X />
              </button>
            </div>
            <div className="text-sm md:text-base leading-relaxed text-gray-700 whitespace-pre-line">
              {description}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
