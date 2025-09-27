"use client";

import { LoaderCircle, X } from "lucide-react";
import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isSubmitting?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isSubmitting = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg">
      <div className="bg-white rounded-xl p-6 md:p-8 max-w-md w-full shadow-lg relative mx-4">
        {/* Tombol close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#A99F99] hover:text-primary"
        >
          <X />
        </button>

        {/* Judul */}
        <h2 className="text-lg font-medium text-center mb-3">{title}</h2>

        {/* Deskripsi */}
        <p className="text-center text-sm text-[#3B3B3B] mb-6">{description}</p>

        {/* Tombol aksi */}
        <div className="flex justify-center text-sm space-x-4">
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="cursor-pointer bg-primary text-white font-medium py-2 px-6 rounded-xl hover:-translate-y-1 duration-150 ease-in disabled:opacity-50"
          >
            {isSubmitting ? (
              <LoaderCircle className="animate-spin w-4" />
            ) : (
              "Iya"
            )}
          </button>
          <button
            onClick={onClose}
            className="cursor-pointer border border-primary text-[#4D2C1D] font-medium py-2 px-6 rounded-xl hover:-translate-y-1 duration-150 ease-in"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
