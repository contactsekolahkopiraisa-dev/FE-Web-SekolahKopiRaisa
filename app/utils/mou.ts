import api from "./api";

export interface MouItem {
  id: number;
  id_layanan: number;
  id_status_pengajuan: number;
  file_mou: string;
  tanggal_upload?: string;
  tanggal_disetujui?: string;
  statusKode?: {
    id: number;
    nama_status_kode: string;
  };
  mouRejection?: {
    id: number;
    id_mou: number;
    alasan: string;
  };
}

// GET MOU BY ID
export const fetchMouById = async (id: number): Promise<MouItem> => {
  try {
    const response = await api.get(`/api/v1/mou/${id}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Gagal mengambil data MOU");
  } catch (error: any) {
    console.error("Error fetching MOU:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Gagal mengambil data MOU"
    );
  }
};

// CREATE MOU (User upload MOU)
export const createMou = async (data: {
  id_layanan: number;
  file_mou: File;
}): Promise<MouItem> => {
  try {
    const formData = new FormData();
    formData.append("id_layanan", data.id_layanan.toString());
    formData.append("file_mou", data.file_mou);

    const response = await api.post("/api/v1/mou", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Gagal mengunggah MOU");
  } catch (error: any) {
    console.error("Error creating MOU:", error);
    throw new Error(
      error.response?.data?.message || error.message || "Gagal mengunggah MOU"
    );
  }
};

// UPDATE MOU (User re-upload MOU setelah ditolak)
export const updateMou = async (
  id: number,
  file_mou: File
): Promise<MouItem> => {
  try {
    const formData = new FormData();
    formData.append("file_mou", file_mou);

    const response = await api.put(`/api/v1/mou/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Gagal memperbarui MOU");
  } catch (error: any) {
    console.error("Error updating MOU:", error);
    throw new Error(
      error.response?.data?.message || error.message || "Gagal memperbarui MOU"
    );
  }
};

// APPROVE MOU (Admin approves MOU)
export const approveMou = async (id: number): Promise<MouItem> => {
  try {
    const response = await api.put(`/api/v1/mou/${id}/approve`);

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Gagal menyetujui MOU");
  } catch (error: any) {
    console.error("Error approving MOU:", error);
    throw new Error(
      error.response?.data?.message || error.message || "Gagal menyetujui MOU"
    );
  }
};

// REJECT MOU (Admin rejects MOU)
export const rejectMou = async (
  id: number,
  alasan: string
): Promise<MouItem> => {
  try {
    const response = await api.put(`/api/v1/mou/${id}/reject`, { alasan });

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Gagal menolak MOU");
  } catch (error: any) {
    console.error("Error rejecting MOU:", error);
    throw new Error(
      error.response?.data?.message || error.message || "Gagal menolak MOU"
    );
  }
};
