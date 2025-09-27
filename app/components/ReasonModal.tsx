"use client";

import { LoaderCircle, X } from "lucide-react";
import React, { useState } from "react";

interface ReasonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reason: string) => void;
    isSubmitting?: boolean;
}

export default function ReasonModal({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting = false,
}: ReasonModalProps) {
    const [reason, setReason] = useState("");

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (reason.trim()) {
            onSubmit(reason);
            setReason("");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg">
            <div className="bg-white rounded-xl p-6 md:p-8 max-w-md w-full shadow-xl relative mx-4">
                {/* Tombol close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[#A99F99] hover:text-gray-800"
                >
                    <X />
                </button>

                {/* Judul */}
                <h2 className="text-lg font-medium text-center mb-3">
                    Alasan Pembatalan
                </h2>

                {/* Input reason */}
                <div className="mb-6">
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Masukkan alasan pembatalan pesanan"
                        className="w-full p-3 border border-[#A99F99] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        rows={4}
                    />
                </div>

                {/* Tombol aksi */}
                <div className="flex justify-center text-sm space-x-4">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !reason.trim()}
                        className="cursor-pointer bg-primary text-white font-medium py-2 px-6 rounded-xl hover:-translate-y-1 duration-150 ease-in disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <LoaderCircle className="animate-spin w-4" />
                        ) : (
                            "Lanjutkan"
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
