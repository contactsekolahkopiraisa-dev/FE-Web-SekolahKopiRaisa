"use client";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

interface ActivityHistoryCardProps {
  id: number;
  title: string;
  submittedDate: string;
  submitterName?: string;
  status: string;
  detailHref: string;
}

export default function ActivityHistoryCard({
  id,
  title,
  submittedDate,
  submitterName,
  status,
  detailHref,
}: ActivityHistoryCardProps) {
  const statusConfig: Record<
    string,
    {
      label: string;
      bgColor: string;
      textColor: string;
      borderColor: string;
      icon: JSX.Element;
    }
  > = {
    Selesai: {
      label: "Selesai",
      bgColor: "bg-cyan-50",
      textColor: "text-cyan-700",
      borderColor: "border-cyan-200",
      icon: <CheckCircle size={14} />,
    },
    Ditolak: {
      label: "Ditolak",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      borderColor: "border-red-200",
      icon: <XCircle size={14} />,
    },
    "Sedang Berjalan": {
      label: "Sedang Berjalan",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-200",
      icon: <CheckCircle size={14} />,
    },
    "Belum Terlaksana": {
      label: "Belum Terlaksana",
      bgColor: "bg-gray-50",
      textColor: "text-gray-700",
      borderColor: "border-gray-200",
      icon: <CheckCircle size={14} />,
    },
  };

  const config = statusConfig[status] || statusConfig["Belum Terlaksana"];

  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900 flex-1 pr-3">
          {title}
        </h3>
        <span
          className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border ${config.bgColor} ${config.textColor} ${config.borderColor} whitespace-nowrap`}
        >
          {config.icon}
          {config.label}
        </span>
      </div>

      {submitterName && (
        <p className="text-sm text-gray-700 font-medium mb-1">
          Diajukan oleh: {submitterName}
        </p>
      )}
      <p className="text-sm text-gray-500 mb-4">Diajukan {submittedDate}</p>

      <Link href={detailHref}>
        <button className="flex items-center gap-2 px-4 py-2 bg-amber-900 text-white text-sm font-medium rounded-lg hover:bg-amber-950 transition-colors">
          <span>Lihat Detail</span>
          <ArrowRight size={16} />
        </button>
      </Link>
    </div>
  );
}
