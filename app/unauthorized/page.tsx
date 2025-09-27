'use client';

import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-xl p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-medium text-gray-900 mb-2">Akses Ditolak</h1>
          <p className="text-gray-600">
            Anda tidak memiliki izin untuk mengakses halaman ini.
          </p>
        </div>
        <div className="">
          <button
            onClick={() => router.back()}
            className="cursor-pointer w-full p-2 bg-primary text-white rounded-xl mt-4 hover:-translate-y-1 duration-150 ease-in text-sm"
          >
            Kembali
          </button>
          <button
            onClick={() => router.push('/')}
            className="cursor-pointer w-full p-2 border border-primary rounded-xl mt-4 hover:-translate-y-1 duration-150 ease-in text-sm"
          >
            Ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
}
