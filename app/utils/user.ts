import api from "./api";



// Get User
export const getUser = async () => {
  try {
    const res = await api.get("/api/v1/auth/user", {
      headers: { "Cache-Control": "no-store" },
    });
    return res.data.data;
  } catch (error: any) {
    console.error("Gagal update user:", error);

    // Tangani error dari server (validasi, dll)
    if (error.response) {
      const { data } = error.response;

      if (data.errors && typeof data.errors === "object") {
        throw {
          type: "validation",
          message: data.message || "Validasi gagal!",
          errors: data.errors,
        };
      }

      throw {
        type: "general",
        message: data.message || "Terjadi kesalahan!",
      };
    }

    // Error jaringan / tidak diketahui
    throw {
      type: "network",
      message: "Tidak dapat terhubung ke server.",
    };
  }
};

// Update User
export const updateUser = async (formData: {
  name: string;
  phone_number: string;
  file: File | null;
}) => {
  try {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("phone_number", formData.phone_number);
    if (formData.file) {
      data.append("media", formData.file); // nama 'media' harus sama seperti di backend
    }

    const res = await api.put("/api/v1/auth/user", data, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error: any) {
    console.error("Gagal update user:", error);

    // Tangani error dari server (validasi, dll)
    if (error.response) {
      const { data } = error.response;

      if (data.errors && typeof data.errors === "object") {
        throw {
          type: "validation",
          message: data.message || "Validasi gagal!",
          errors: data.errors,
        };
      }

      throw {
        type: "general",
        message: data.message || "Terjadi kesalahan!",
      };
    }

    // Error jaringan / tidak diketahui
    throw {
      type: "network",
      message: "Tidak dapat terhubung ke server.",
    };
  }
};
