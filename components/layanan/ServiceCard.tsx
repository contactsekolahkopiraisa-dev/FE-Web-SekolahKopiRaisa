"use client";
import { Clock, User, ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface ServiceActivity {
  category: string;
  items: string[];
}

interface ServiceCardProps {
  id: number;
  icon: ReactNode;
  title: string;
  description: string;
  duration: string;
  target: string;
  route: string;
  image?: string;
  fullDescription?: string[];
  activities?: ServiceActivity[];
}

export default function ServiceCard({
  icon,
  title,
  description,
  duration,
  target,
  route,
  image = "/assets/tk1.png",
  fullDescription = [],
  activities = [],
}: ServiceCardProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 p-8 flex flex-col border border-gray-100">
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="text-amber-900">{icon}</div>
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

      {/* Modal - Detail Layanan Lengkap */}
      {open &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-transparent backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-4xl bg-white min-h-screen md:min-h-0 md:my-8 md:rounded-2xl shadow-2xl">
              {/* Header with back button and title */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center gap-4 md:rounded-t-2xl z-10">
                <button
                  onClick={() => setOpen(false)}
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
                      {fullDescription.length > 0 ? (
                        fullDescription.map((paragraph, index) => (
                          <p
                            key={index}
                            className="text-sm text-gray-700 leading-relaxed"
                          >
                            {paragraph}
                          </p>
                        ))
                      ) : (
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {description}
                        </p>
                      )}
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
                      <span className="font-semibold text-gray-900">
                        Durasi:
                      </span>
                      <span className="text-gray-700">{duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        Peserta:
                      </span>
                      <span className="text-gray-700">{target}</span>
                    </div>
                  </div>
                </div>

                {/* Activities - Two Column Layout */}
                {activities.length > 0 && (
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
                                <span className="text-amber-700 mt-0.5">
                                  {String.fromCharCode(97 + itemIndex)}.
                                </span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
