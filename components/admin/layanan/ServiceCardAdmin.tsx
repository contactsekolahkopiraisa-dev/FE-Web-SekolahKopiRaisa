"use client";
import { Clock, User, ChevronRight, Eye, Pencil } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ServiceDetailModal from "./ServiceDetailModal";
import {
  confirmDeactivateService,
  confirmActivateService,
  showSuccessAlert,
  showErrorAlert,
} from "@/app/utils/sweetalert";

interface ServiceActivity {
  category: string;
  items: string[];
}

interface ServiceCardAdminProps {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  duration: string;
  target: string;
  image: string;
  fullDescription: string[];
  activities: ServiceActivity[];
  editHref: string;
  isActive?: boolean; // Status aktif/nonaktif
}

export default function ServiceCardAdmin({
  id,
  icon,
  title,
  description,
  duration,
  target,
  image,
  fullDescription,
  activities,
  editHref,
  isActive = true,
}: ServiceCardAdminProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [active, setActive] = useState(isActive);
  const [pending, setPending] = useState(false);

  const handleToggleStatus = async () => {
    const result = active
      ? await confirmDeactivateService(title)
      : await confirmActivateService(title);

    if (result.isConfirmed) {
      try {
        await showSuccessAlert(
          active
            ? "Layanan berhasil dinonaktifkan"
            : "Layanan berhasil diaktifkan"
        );
      } catch (error) {
        await showErrorAlert(
          `Gagal ${active ? "menonaktifkan" : "mengaktifkan"} layanan. Silakan coba lagi.`
        );
      } finally {
        setPending(false);
      }
    }
  };

  return (
    <>
      <div
        className={`bg-white rounded-xl shadow-md p-5 border transition-all ${
          active
            ? "border-gray-100"
            : "border-gray-300 opacity-75 bg-gray-50"
        }`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="text-amber-900">{icon}</div>
          {!active && (
            <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-200 rounded-md">
              Nonaktif
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-gray-900 font-semibold mb-2">
          <span>{title}</span>
          <ChevronRight size={16} className="text-gray-400" />
        </div>
        <p className="text-xs text-gray-600 leading-relaxed mb-3">
          {description}
        </p>

        <div className="flex items-center gap-2 text-xs text-gray-600">
          <div className="flex-1 flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-md px-2 py-1">
            <Clock size={12} />
            <span>{duration}</span>
          </div>
          <div className="flex-1 flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-md px-2 py-1">
            <User size={12} />
            <span>{target}</span>
          </div>
        </div>

        <div className="mt-4 flex items-stretch gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs w-full py-2.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-1.5 font-medium"
          >
            <Eye size={14} />
            <span>Lihat</span>
          </button>
          <Link href={editHref} className="text-xs w-full">
            <button className="w-full py-2.5 rounded-md bg-amber-900 text-white hover:bg-amber-950 transition-all flex items-center justify-center gap-1.5 font-medium">
              <Pencil size={14} />
              <span>Edit</span>
            </button>
          </Link>
          <button
            onClick={handleToggleStatus}
            disabled={pending}
            className={`text-xs w-full py-2.5 rounded-md transition-all font-medium ${
              active
                ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
            } ${pending ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {pending ? "Menyimpan..." : active ? "Nonaktifkan" : "Aktifkan"}
          </button>
        </div>
      </div>

      <ServiceDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        image={image}
        description={fullDescription}
        duration={duration}
        target={target}
        activities={activities}
      />
    </>
  );
}

function toggleServiceStatus(id: number, arg1: boolean) {
    throw new Error("Function not implemented.");
}
