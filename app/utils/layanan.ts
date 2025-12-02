import api from "./api";

// Types untuk Layanan
export interface LayananItem {
  status_pengajuan_kode: any;
  id: number;
  nama_kegiatan: string;
  tempat_kegiatan: string;
  jumlah_peserta: number;
  instansi_asal: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  durasi_dalam_bulan?: number;
  link_logbook?: string;
  file_proposal?: string;
  file_surat_permohonan?: string;
  file_surat_pengantar?: string;
  file_surat_undangan?: string;
  created_at: string;
  pemohon: {
    id: number;
    name: string;
    email: string;
  };
  peserta?: Array<{
    id: number;
    nama_peserta: string;
    instansi_asal: string;
    fakultas?: string;
    program_studi?: string;
    nim?: string;
  }>;
  pengajuan: {
    id: number;
    nama_status_kode: string;
  };
  pelaksanaan: {
    id: number;
    nama_status_kode: string;
  };
  mou?: {
    id: number;
    statusKode: {
      id: number;
      nama_status_kode: string;
    };
    file_mou?: string;
    tanggal_upload?: string;
  };
  sertifikat?: {
    id?: number;
    nama_status_kode?: string;
    status?: {
      id: number;
      nama_status_kode: string;
    };
  };
  laporan?: {
    length: number;
    id?: number;
    nama_status_kode?: string;
    nama_p4s?: string;
    asal_kab_kota?: string;
    foto_kegiatan?: string;
    statusPelaporan?: {
      id: number;
      nama_status_kode: string;
    };
    status?: {
      id: number;
      nama_status_kode: string;
    };
    layanan?: {
      nama_kegiatan?: string;
      jenisLayanan?: {
        nama_jenis_layanan: string;
      };
    };
  };
  kegiatan?: Array<{
    id: number;
    nama_kegiatan: string;
  }>;
  jenis_layanan?: {
    id: number;
    nama_jenis_layanan: string;
  };
  jenisLayanan?: {
    id: number;
    nama_jenis_layanan: string;
  };
}

export interface LayananQueryParams {
  include_jenis?: boolean;
  include_peserta?: boolean;
  include_mou?: boolean;
  include_sertifikat?: boolean;
  include_laporan?: boolean;
}

// GET ALL LAYANAN (untuk user dan admin)
export const fetchAllLayanan = async (
  params?: LayananQueryParams
): Promise<LayananItem[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.include_jenis) queryParams.append("include_jenis", "true");
    if (params?.include_peserta) queryParams.append("include_peserta", "true");
    if (params?.include_mou) queryParams.append("include_mou", "true");
    if (params?.include_sertifikat)
      queryParams.append("include_sertifikat", "true");
    if (params?.include_laporan) queryParams.append("include_laporan", "true");

    const url = `/api/v1/layanan${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    console.log("Fetching layanan from:", url);

    const response = await api.get(url);
    console.log("Layanan response:", response.data);

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Gagal mengambil data layanan");
  } catch (error: any) {
    console.error("Error fetching layanan:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Gagal mengambil data layanan"
    );
  }
};

// GET LAYANAN BY ID
export const fetchLayananById = async (
  id: number,
  params?: LayananQueryParams
): Promise<LayananItem> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.include_jenis) queryParams.append("include_jenis", "true");
    if (params?.include_peserta) queryParams.append("include_peserta", "true");
    if (params?.include_mou) queryParams.append("include_mou", "true");
    if (params?.include_sertifikat)
      queryParams.append("include_sertifikat", "true");
    if (params?.include_laporan) queryParams.append("include_laporan", "true");

    const url = `/api/v1/layanan/${id}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    console.log("Fetching layanan detail from:", url);

    const response = await api.get(url);
    console.log("Layanan detail response:", response.data);

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Gagal mengambil detail layanan");
  } catch (error: any) {
    console.error("Error fetching layanan detail:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Gagal mengambil detail layanan"
    );
  }
};

// POST CREATE LAYANAN
export const createLayanan = async (
  formData: FormData
): Promise<LayananItem> => {
  try {
    // Debug isi FormData
    const debugEntries: Record<string, any> = {};
    formData.forEach((v, k) => {
      debugEntries[k] = v instanceof File ? `File(name=${v.name}, size=${v.size})` : v;
    });
    console.log("Creating layanan with data:", debugEntries);

    // Biarkan axios/browser set Content-Type + boundary otomatis
    const response = await api.post("/api/v1/layanan", formData);
    console.log("Create layanan response:", response.data);

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Gagal membuat layanan");
  } catch (error: any) {
    console.error("Error creating layanan:", error);
    console.error("Response status:", error?.response?.status);
    console.error("Response data:", error?.response?.data);
    console.error("Response headers:", error?.response?.headers);
    const serverMsg = error?.response?.data?.message || error?.response?.data?.error || JSON.stringify(error?.response?.data);
    throw new Error(serverMsg || error.message || "Gagal membuat layanan");
  }
};

// PUT UPDATE STATUS LAYANAN
export interface UpdateStatusPayload {
  tahapan: "PENGAJUAN" | "MOU" | "PELAKSANAAN" | "LAPORAN";
  id_status_pengajuan: number;
  alasan?: string;
}

export const updateStatusLayanan = async (
  id: number,
  payload: UpdateStatusPayload
): Promise<LayananItem> => {
  try {
    console.log("Updating layanan status:", id, payload);

    const response = await api.put(`/api/v1/layanan/status/${id}`, payload);
    console.log("Update status response:", response.data);

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Gagal mengupdate status layanan");
  } catch (error: any) {
    console.error("Error updating layanan status:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Gagal mengupdate status layanan"
    );
  }
};

// POST/PUT LOGBOOK
export interface LogbookPayload {
  id_layanan: number;
  link_logbook: string;
}

export const submitLogbook = async (
  id: number,
  payload: LogbookPayload
): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    console.log("Submitting logbook for layanan:", id, payload);
    console.log("API URL:", `/api/v1/layanan/${id}/logbook`);

    // Backend uses PUT for both create and update logbook
    const response = await api.put(`/api/v1/layanan/${id}/logbook`, payload);
    console.log("Submit logbook response:", response.data);

    // Handle different response formats
    if (response.data && (response.data.success || response.status === 200 || response.status === 201)) {
      return {
        success: true,
        message: response.data.message || "Logbook berhasil dikirim",
        data: response.data.data || response.data
      };
    }
    throw new Error(response.data?.message || "Gagal mengirim logbook");
  } catch (error: any) {
    console.error("Error submitting logbook:", error);
    console.error("Error response:", error.response);
    console.error("Error status:", error.response?.status);
    console.error("Error data:", error.response?.data);
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Gagal mengirim logbook"
    );
  }
};

export const updateLogbook = async (
  id: number,
  payload: LogbookPayload
): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    console.log("Updating logbook for layanan:", id, payload);
    console.log("API URL:", `/api/v1/layanan/${id}/logbook`);

    const response = await api.put(`/api/v1/layanan/${id}/logbook`, payload);
    console.log("Update logbook response:", response.data);

    // Handle different response formats
    if (response.data && (response.data.success || response.status === 200)) {
      return {
        success: true,
        message: response.data.message || "Logbook berhasil diupdate",
        data: response.data.data || response.data
      };
    }
    throw new Error(response.data?.message || "Gagal mengupdate logbook");
  } catch (error: any) {
    console.error("Error updating logbook:", error);
    console.error("Error response:", error.response);
    console.error("Error status:", error.response?.status);
    console.error("Error data:", error.response?.data);
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Gagal mengupdate logbook"
    );
  }
};

// UPDATE STATUS PELAKSANAAN
export const updateStatusPelaksanaan = async (
  id: number,
  status: "SELESAI" | "BERLANGSUNG"
): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    console.log("Finishing pelaksanaan for layanan:", id);
    console.log("API URL:", `/api/v1/layanan/${id}/finish-pelaksanaan`);

    const response = await api.put(`/api/v1/layanan/${id}/finish-pelaksanaan`);
    console.log("Finish pelaksanaan response:", response.data);

    if (response.data && (response.data.success || response.status === 200 || response.status === 201)) {
      return {
        success: true,
        message: response.data.message || "Status pelaksanaan berhasil diupdate",
        data: response.data.data || response.data
      };
    }
    throw new Error(response.data?.message || "Gagal mengupdate status pelaksanaan");
  } catch (error: any) {
    console.error("Error finishing pelaksanaan:", error);
    console.error("Error response:", error.response);
    console.error("Error status:", error.response?.status);
    console.error("Error data:", error.response?.data);
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Gagal mengupdate status pelaksanaan"
    );
  }
};

// Helper function untuk format status badge
export const getStatusColor = (status: string): string => {
  const statusLower = status.toLowerCase();
  if (statusLower.includes("disetujui") || statusLower.includes("selesai")) {
    return "bg-green-100 text-green-700 border-green-200";
  }
  if (statusLower.includes("ditolak") || statusLower.includes("batal")) {
    return "bg-red-100 text-red-700 border-red-200";
  }
  if (statusLower.includes("menunggu") || statusLower.includes("pending")) {
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  }
  if (statusLower.includes("berlangsung") || statusLower.includes("proses")) {
    return "bg-blue-100 text-blue-700 border-blue-200";
  }
  return "bg-gray-100 text-gray-700 border-gray-200";
};

// Helper function untuk format tanggal
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Helper function untuk format nama jenis layanan ke slug
export const getSlugFromJenisLayanan = (namaJenis: string): string => {
  const namaLower = namaJenis.toLowerCase();
  if (namaLower.includes("pkl")) return "pkl";
  if (namaLower.includes("magang")) return "magang";
  if (namaLower.includes("pelatihan")) return "pelatihan";
  if (namaLower.includes("kunjungan")) return "kunjungan";
  if (namaLower.includes("narasumber")) return "undangan-narasumber";
  return namaJenis.toLowerCase().replace(/\s+/g, "-");
};
