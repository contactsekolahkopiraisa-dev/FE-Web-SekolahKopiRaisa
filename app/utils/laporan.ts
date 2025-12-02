import api from "./api";

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
    });

    const response = await api.post("/api/v1/laporan-layanan", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    console.log("Create laporan response:", response.data);

    return response.data;
  } catch (error: any) {
    console.error("Error creating laporan layanan:", error);
    console.error("Error response:", error.response);
    console.error("Error status:", error.response?.status);
    console.error("Error data:", error.response?.data);
    throw new Error(
      error.response?.data?.message || 
      error.response?.data?.error ||
      error.message || 
      "Gagal mengirim laporan layanan"
    );
  }
};
