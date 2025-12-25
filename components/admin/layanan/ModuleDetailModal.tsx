"use client";
import { ArrowLeft, FileText } from "lucide-react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

interface Module {
  id: number;
  title: string;
  description: string;
  image: string;
  moduleFile?: string;
}

interface ModuleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  module: Module;
}

export default function ModuleDetailModal({
  isOpen,
  onClose,
  module,
}: ModuleDetailModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white min-h-screen md:min-h-0 md:my-8 md:rounded-2xl shadow-2xl">
        {/* Header with back button and title */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center gap-4 md:rounded-t-2xl z-10">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Close"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-2">
            <FileText size={24} className="text-amber-900" />
            <h2 className="text-3xl font-bold text-gray-900">{module.title}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Image and Description Section */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Description (Left) */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Deskripsi
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {module.description}
                  </p>
                </div>
              </div>

              {/* Image (Right) */}
              <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={module.image}
                  alt={module.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Module File Section */}
          {module.moduleFile && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                File Modul
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <FileText size={20} className="text-gray-500" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 font-medium">
                      {module.title}.pdf
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      File modul pembelajaran
                    </p>
                  </div>
                  <a
                    href={module.moduleFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-amber-900 text-white rounded-lg hover:bg-amber-950 transition text-sm font-medium"
                  >
                    Download
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
