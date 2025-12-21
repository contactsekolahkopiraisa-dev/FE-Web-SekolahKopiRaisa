"use client";
import { ArrowLeft, Clock, User } from "lucide-react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

interface ServiceActivity {
  category: string;
  items: string[];
}

interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  image: string;
  description: string[];
  duration: string;
  target: string;
  activities: ServiceActivity[];
}

export default function ServiceDetailModal({
  isOpen,
  onClose,
  title,
  image,
  description,
  duration,
  target,
  activities,
}: ServiceDetailModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-transparent backdrop-blur-sm overflow-y-auto">
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
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Image and Description Section - Side by Side */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Description (Left) */}
              <div className="space-y-4">
                {description.map((paragraph, index) => (
                  <p key={index} className="text-sm text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Image (Right) */}
              <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Duration and Target - Compact */}
          <div className="mb-8">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">Durasi:</span>
                <span className="text-gray-700">{duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">Peserta:</span>
                <span className="text-gray-700">{target}</span>
              </div>
            </div>
          </div>

          {/* Activities - Two Column Layout */}
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-6">
              Kegiatan yang bisa dipilih
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {activities.map((activity, index) => (
                <div key={index}>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    {index + 1}. {activity.category}
                  </h4>
                  <ul className="space-y-1.5">
                    {activity.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="text-sm text-gray-700 flex items-start gap-2"
                      >
                        <span className="text-amber-700 mt-0.5">{String.fromCharCode(97 + itemIndex)}.</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}


