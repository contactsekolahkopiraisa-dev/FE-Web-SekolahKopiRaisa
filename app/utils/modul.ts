import api from "./api";
import { ModulItem, ModulFormData } from "../types/modulType";

// GET ALL MODUL
export const fetchAllModul = async (): Promise<ModulItem[]> => {
  try {
    console.log("Fetching moduls from API...");
    const response = await api.get("/api/v1/modul");
    console.log("Modul response:", response);
    console.log("Modul data:", response.data);
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching modul:", error);
    console.error("Error response:", error.response);
    console.error("Error message:", error.message);
    throw new Error(
      error.response?.data?.message || "Gagal mengambil data modul"
    );
  }
};

// GET MODUL BY ID
export const fetchModulById = async (id: number): Promise<ModulItem> => {
  try {
    console.log("Fetching modul by id:", id);
    const response = await api.get(`/api/v1/modul/${id}`);
    console.log("Modul by id response:", response.data);
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching modul by id:", error);
    console.error("Error response:", error.response);
    throw new Error(
      error.response?.data?.message || "Gagal mengambil detail modul"
    );
  }
};

// CREATE NEW MODUL
export const createModul = async (
  formData: ModulFormData
): Promise<ModulItem> => {
  try {
    const data = new FormData();
    data.append("judul_modul", formData.judul_modul);
    data.append("deskripsi", formData.deskripsi);
    if (formData.file_modul) {
      data.append("file_modul", formData.file_modul);
    }
    if (formData.logo_judul) {
      data.append("logo_judul", formData.logo_judul);
    }

    const response = await api.post("/api/v1/modul", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Error creating modul:", error);
    throw new Error(error.response?.data?.message || "Gagal menambahkan modul");
  }
};

// UPDATE MODUL BY ID
export const updateModul = async (
  id: number,
  formData: ModulFormData
): Promise<ModulItem> => {
  try {
    const data = new FormData();
    data.append("judul_modul", formData.judul_modul);
    data.append("deskripsi", formData.deskripsi);
    if (formData.file_modul) {
      data.append("file_modul", formData.file_modul);
    }
    if (formData.logo_judul) {
      data.append("logo_judul", formData.logo_judul);
    }

    const response = await api.put(`/api/v1/modul/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Error updating modul:", error);
    throw new Error(error.response?.data?.message || "Gagal memperbarui modul");
  }
};

// DELETE MODUL BY ID
export const deleteModul = async (id: number): Promise<void> => {
  try {
    await api.delete(`/api/v1/modul/${id}`);
  } catch (error: any) {
    console.error("Error deleting modul:", error);
    throw new Error(error.response?.data?.message || "Gagal menghapus modul");
  }
};
