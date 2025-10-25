import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MagangHeader() {
  return (
    <div className="bg-white py-8 pt-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center mb-6">
          <Link href="/layanan" className="flex items-center text-amber-600 hover:text-amber-700 transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            <span className="font-medium">Kembali ke Layanan</span>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          Form Pengajuan Kunjungan
        </h1>
      </div>
    </div>
  );
}


