import { Phone, SquarePen, Trash } from "lucide-react";
import { useState } from "react";

export interface PartnerListProps {
  id: number;
  name: string;
  owner_name: string;
  phone_number: string;
  address: string;
  products: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onCall?: (id: string) => void;
}

export default function PartnerTable({
  partner,
  onEdit,
  onDelete,
  onCall,
}: {
  partner: PartnerListProps[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onCall?: (id: number) => void;
}) {
  return (
    <div className="bg-tertiary shadow-lg rounded-xl overflow-hidden">
      {/* Horizontal scroll container for mobile */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-primary text-xs sm:text-sm text-white">
            <tr>
              <th className="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">
                Nama Mitra
              </th>
              <th className="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">
                Nama Pemilik
              </th>
              <th className="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">
                No. Telpon
              </th>
          
              <th className="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">
                Produk Terdaftar
              </th>
              <th className="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="text-xs sm:text-sm text-gray-700 divide-y divide-gray-200">
            {partner.map((item, idx) => (
              <tr key={idx}>
                <td className="px-2 sm:px-4 py-3">
                  <div className="text-gray-900 whitespace-nowrap">
                    {item.name}
                  </div>
                  {/* <div className="text-xs text-gray-500">
                                      {item.id}
                                  </div> */}
                </td>
                <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                  {item.owner_name}
                </td>
                <td className="px-2 sm:px-4 py-3">
                  <span className="inline-block bg-yellow-100 px-1 sm:px-2 py-1 rounded-xl text-gray-900 text-xs sm:text-sm whitespace-nowrap">
                    {item.phone_number}
                  </span>
                </td>

              
                <td className="px-2 sm:px-4 py-3 max-w-xs truncate">
                  {item.products}
                </td>
                <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                  {/* Edit */}
                  <button
                    onClick={() => onEdit?.(item.id)}
                    className="cursor-pointer p-1.5 sm:p-2 text-white rounded-xl bg-blue-500 hover:-translate-y-1 duration-150 ease-in"
                    title="Edit"
                  >
                    <SquarePen size={18} className="" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
