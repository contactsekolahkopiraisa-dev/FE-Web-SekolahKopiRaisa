import api from "./api";

// Types untuk Sertifikat
export interface SertifikatItem {
  id: number;
  id_layanan?: number;
  link_sertifikat: string | null;
  file_sertifikat: string;
  created_at: string;
  updated_at?: string;
  layanan?: {
    id: number;
    instansi_asal: string;
    jumlah_peserta: number;
    tanggal_mulai: string;
    tanggal_selesai: string;
  };
}

export interface SertifikatResponse {
  success: boolean;
  message: string;
  data?: SertifikatItem;
}

// GET SERTIFIKAT BY LAYANAN ID
export const fetchSertifikatById = async (
  idLayanan: number
): Promise<SertifikatItem> => {
  try {
    console.log("Fetching sertifikat detail from:", `/api/v1/sertifikat/${idLayanan}`);

    const response = await api.get(`/api/v1/sertifikat/${idLayanan}`);
    console.log("Sertifikat detail response:", response.data);

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Gagal mengambil detail sertifikat");
  } catch (error: any) {
    console.error("Error fetching sertifikat detail:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Gagal mengambil detail sertifikat"
    );
  }
};
