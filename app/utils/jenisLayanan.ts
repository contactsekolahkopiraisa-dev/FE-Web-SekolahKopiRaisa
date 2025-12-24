import api from "./api";
import {
  JenisLayananItem,
  JenisLayananFormData,
  TargetPesertaItem,
} from "../types/jenisLayananType";

// ============ JENIS LAYANAN ============

// GET ALL JENIS LAYANAN
export const fetchAllJenisLayanan = async (): Promise<JenisLayananItem[]> => {
  try {
    console.log("Fetching jenis layanan from API...");
    const response = await api.get("/api/v1/jenis-layanan");
    console.log("Jenis layanan response:", response);
    console.log(
      "Jenis layanan data:",
      JSON.stringify(response.data.data, null, 2)
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching jenis layanan:", error);
    console.error("Error response:", error.response);
    throw new Error(
      error.response?.data?.message || "Gagal mengambil data jenis layanan"
    );
  }
};

// GET JENIS LAYANAN BY ID
export const fetchJenisLayananById = async (
  id: number
): Promise<JenisLayananItem> => {
  try {
    console.log(`Fetching jenis layanan by id: ${id}`);
    const response = await api.get(`/api/v1/jenis-layanan/${id}`);
    console.log("Jenis layanan detail:", response.data);
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching jenis layanan by id:", error);
    throw new Error(
      error.response?.data?.message || "Gagal mengambil detail jenis layanan"
    );
  }
};

// UPDATE JENIS LAYANAN BY ID
export const updateJenisLayanan = async (
  id: number,
  formData: JenisLayananFormData
): Promise<JenisLayananItem> => {
  try {
    const data = new FormData();
    if (formData.nama) {
      data.append("nama_jenis_layanan", formData.nama);
    }
    if (formData.deskripsi_singkat) {
      data.append("deskripsi_singkat", formData.deskripsi_singkat);
    }
    if (formData.deskripsi_lengkap) {
      data.append("deskripsi_lengkap", formData.deskripsi_lengkap);
    }
    if (formData.durasi) {
      data.append("estimasi_waktu", formData.durasi);
    }
    if (formData.id_target_peserta) {
      data.append("id_target_peserta", formData.id_target_peserta.toString());
    }
    if (formData.image) {
      data.append("image", formData.image);
    }
    if (formData.is_active !== undefined) {
      data.append("is_active", formData.is_active.toString());
    }

    const response = await api.put(`/api/v1/jenis-layanan/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Error updating jenis layanan:", error);
    throw new Error(
      error.response?.data?.message || "Gagal memperbarui jenis layanan"
    );
  }
};

// ============ TARGET PESERTA ============

// GET ALL TARGET PESERTA
export const fetchAllTargetPeserta = async (): Promise<TargetPesertaItem[]> => {
  try {
    console.log("Fetching target peserta from API...");
    const response = await api.get("/api/v1/target-peserta");
    console.log("Target peserta response:", response);
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching target peserta:", error);
    throw new Error(
      error.response?.data?.message || "Gagal mengambil data target peserta"
    );
  }
};

// GET TARGET PESERTA BY ID
export const fetchTargetPesertaById = async (
  id: number
): Promise<TargetPesertaItem> => {
  try {
    const response = await api.get(`/api/v1/target-peserta/${id}`);
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching target peserta by id:", error);
    throw new Error(
      error.response?.data?.message || "Gagal mengambil detail target peserta"
    );
  }
};
