"use client";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

interface ActivityHistoryCardProps {
  id: number;
  title: string;
  submittedDate: string;
  status: "selesai" | "ditolak";
  detailHref: string;
}

export default function ActivityHistoryCard({
  id,
  title,
  submittedDate,
  status,
  detailHref,
}: ActivityHistoryCardProps) {
  const statusConfig = {
    selesai: {
      label: "Selesai",
      bgColor: "bg-cyan-50",
      textColor: "text-cyan-700",
      borderColor: "border-cyan-200",
      icon: <CheckCircle size={14} />,
    },
    ditolak: {
      label: "Ditolak",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      borderColor: "border-red-200",
      icon: <XCircle size={14} />,
    },
  };

  const config = statusConfig[status];

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