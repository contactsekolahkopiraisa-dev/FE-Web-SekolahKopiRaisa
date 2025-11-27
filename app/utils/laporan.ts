import api from "./api";

// Types untuk Laporan Layanan
export interface LaporanLayananPayload {
  id_layanan: number;
  nama_p4s: string;
  asal_kab_kota: string;
  id_jenis_layanan: number;
  asal_mitra_kerjasama: string;
  jumlah_peserta: number;
  tanggal_pelaksanaan: string;
  lama_pelaksanaan: string;
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
    formData.append("id_jenis_layanan", payload.id_jenis_layanan.toString());
    formData.append("asal_mitra_kerjasama", payload.asal_mitra_kerjasama);
    formData.append("jumlah_peserta", payload.jumlah_peserta.toString());
    formData.append("tanggal_pelaksanaan", payload.tanggal_pelaksanaan);
    formData.append("lama_pelaksanaan", payload.lama_pelaksanaan);
    formData.append("foto_kegiatan", payload.foto_kegiatan);

    console.log("Creating laporan layanan with data:", {
      id_layanan: payload.id_layanan,
      nama_p4s: payload.nama_p4s,
      asal_kab_kota: payload.asal_kab_kota,
      id_jenis_layanan: payload.id_jenis_layanan,
      asal_mitra_kerjasama: payload.asal_mitra_kerjasama,
      jumlah_peserta: payload.jumlah_peserta,
      tanggal_pelaksanaan: payload.tanggal_pelaksanaan,
      lama_pelaksanaan: payload.lama_pelaksanaan,
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
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      "Gagal mengirim laporan layanan"
    );
  }
};
