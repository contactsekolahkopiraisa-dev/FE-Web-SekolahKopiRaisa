"use client";
import { Eye, SquarePen, Trash } from "lucide-react";
export interface ActivityListProps {
  id: number;
  title: string;
  content: string;
  image: string;
  time: string;
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
  onView?: (id: number) => void;
}
export default function ActivityListAdmin({
  id,
  title,
  content,
  image,
  time,
  onDelete,
  onEdit,
  onView,
}: ActivityListProps) {
  const item = { id, title, content, image, time };

  return (
    <div className="cursor-pointer bg-tertiary border border-gray-300 rounded-xl p-2 md:p-3 flex flex-col sm:flex-row justify-between shadow-lg">
      <div
        className="flex flex-col sm:flex-row"
        onClick={() => onView?.(item.id)}
      >
        <div className="sm:mr-4 flex-shrink-0 mb-3 sm:mb-0">
          <img
            src={item.image}
            alt="Activity thumbnail"
            className="w-full sm:w-32 h-40 sm:h-24 object-cover rounded"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-sm font-medium text-gray-800">{item.title}</h2>
          <div className="text-sm text-gray-600 mt-1">
            <span>Diunggah</span> • <span>{item.time}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-end sm:items-center space-x-2 mt-3 md:mt-0">
        {/* Edit */}
        <button
          onClick={() => onEdit?.(item.id)}
          className="cursor-pointer p-2 text-white rounded-xl bg-blue-500 hover:-translate-y-1 duration-150 ease-in"
          title="Edit"
        >
          <SquarePen size={18} />
        </button>
        {/* Delete */}
        <button
          onClick={() => onDelete?.(item.id)}
          className="cursor-pointer p-2 text-white rounded-xl bg-red-500 hover:-translate-y-1 duration-150 ease-in"
          title="Hapus"
        >
          <Trash size={18} />
        </button>
      </div>
    </div>
  );
}
