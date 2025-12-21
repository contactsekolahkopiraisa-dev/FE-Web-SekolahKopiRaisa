import api from "./api";
import axios from "axios";

// Types untuk Laporan Layanan
export interface LaporanLayananPayload {
  id_layanan: number;
  nama_p4s: string;
  asal_kab_kota: string;
  foto_kegiatan: File;
}

export interface LaporanLayananResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    id_layanan: number;
    nama_p4s: string;
    asal_kab_kota: string;
    foto_kegiatan: string;
    created_at: string;
  };
}

// POST CREATE LAPORAN LAYANAN
export const createLaporanLayanan = async (
  payload: LaporanLayananPayload
): Promise<LaporanLayananResponse> => {
  try {
    const formData = new FormData();
    formData.append("id_layanan", payload.id_layanan.toString());
    formData.append("nama_p4s", payload.nama_p4s);
    formData.append("asal_kab_kota", payload.asal_kab_kota);
    formData.append("foto_kegiatan", payload.foto_kegiatan);

    console.log("Creating laporan layanan with data:", {
      id_layanan: payload.id_layanan,
      nama_p4s: payload.nama_p4s,
      asal_kab_kota: payload.asal_kab_kota,
      foto_kegiatan: payload.foto_kegiatan.name,
      foto_size: payload.foto_kegiatan.size,
      foto_type: payload.foto_kegiatan.type,
    });

    const response = await api.post("/api/v1/laporan-layanan", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Create laporan response:", response.data);

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Gagal mengirim laporan");
  } catch (error: any) {
    console.error("Error creating laporan layanan:", error);
    throw new Error(
      error.response?.data?.message || error.message || "Gagal mengirim laporan"
    );

    // Handle CORS error
    if (
      error.message?.includes("Network Error") ||
      error.code === "ERR_NETWORK"
    ) {
      throw new Error(
        "Tidak dapat terhubung ke server. Pastikan Anda sudah login dan koneksi internet stabil."
      );
    }

    // Handle specific error responses
    if (error.response?.status === 401) {
      throw new Error("Sesi Anda telah berakhir. Silakan login kembali.");
    }

    if (error.response?.status === 403) {
      throw new Error("Anda tidak memiliki akses untuk mengirim laporan.");
    }

    if (error.response?.status === 422) {
      throw new Error(
        error.response?.data?.message ||
          "Data yang Anda kirim tidak valid. Periksa kembali form Anda."
      );
    }

    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Gagal mengirim laporan layanan"
    );
  }
};
