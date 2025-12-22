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

export interface CreateSertifikatPayload {
  id_layanan: number;
  link_sertifikat?: string;
  file_sertifikat: File;
}

// GET SERTIFIKAT BY LAYANAN ID
export const fetchSertifikatById = async (
  idLayanan: number
): Promise<SertifikatItem> => {
  try {
    console.log(
      "Fetching sertifikat detail from:",
      `/api/v1/sertifikat/${idLayanan}`
    );

    const response = await api.get(`/api/v1/sertifikat/${idLayanan}`);
    console.log("Sertifikat detail response:", response.data);

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(
      response.data.message || "Gagal mengambil detail sertifikat"
    );
  } catch (error: any) {
    console.error("Error fetching sertifikat detail:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Gagal mengambil detail sertifikat"
    );
  }
};

// CREATE/UPLOAD SERTIFIKAT (Admin only)
export const createSertifikat = async (
  payload: CreateSertifikatPayload
): Promise<SertifikatItem> => {
  try {
    console.log("Creating sertifikat for layanan:", payload.id_layanan);
    console.log(
      "File to upload:",
      payload.file_sertifikat?.name,
      payload.file_sertifikat?.type
    );

    const formData = new FormData();
    formData.append("id_layanan", payload.id_layanan.toString());
    if (payload.link_sertifikat) {
      formData.append("link_sertifikat", payload.link_sertifikat);
    }
    formData.append("file_sertifikat", payload.file_sertifikat);

    console.log("FormData contents:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const response = await api.post("/api/v1/sertifikat", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Create sertifikat response:", response.data);

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Gagal mengupload sertifikat");
  } catch (error: any) {
    console.error("Error creating sertifikat:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Gagal mengupload sertifikat"
    );
  }
};
