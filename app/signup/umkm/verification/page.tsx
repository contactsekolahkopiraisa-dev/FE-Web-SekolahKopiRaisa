"use client";

import { CheckCircle, Mail, Phone } from "lucide-react";

export default function VerificationUMKM() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-xl w-full">
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 lg:p-10">
          {/* Icon Success */}
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 text-green-500" />
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6">
            Pendaftaran Berhasil!
          </h1>

          {/* Content */}
          <div className="space-y-5 text-gray-600 text-sm sm:text-base leading-relaxed">
            <p>
              Terima kasih telah melakukan pendaftaran UMKM di website resmi{" "}
              <span className="font-semibold text-gray-800">Kopi Raisa</span>.
              Kami akan melakukan verifikasi paling lambat{" "}
              <span className="font-semibold text-gray-800">3 x 24 jam</span>.
            </p>

            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p>
                Anda akan mendapat pesan email setelah akun Anda diverifikasi.
              </p>
            </div>

            <p>
              Jika dalam 3 x 24 jam Anda belum menerima email verifikasi,
              silakan menghubungi kami melalui halaman kontak atau nomor
              WhatsApp di bawah ini:
            </p>

            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
              <Phone className="w-5 h-5 text-green-600 flex-shrink-0" />
              <a
                href="https://wa.me/6289"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-green-600 hover:text-green-700 hover:underline"
              >
                089 xxx xxx
              </a>
            </div>
          </div>

          {/* Button */}
          <div className="mt-8">
            <button
              onClick={() => (window.location.href = "/")}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-secondary hover:text-primary transition-colors"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
