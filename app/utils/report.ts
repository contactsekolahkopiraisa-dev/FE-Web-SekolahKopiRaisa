import api from "./api";

export const fetchAllReport = async () => {
    const response = await api.get("/api/v1/report");
    return response.data;
};

export const fetchReportById = async (id: number) => {
    const response = await api.get(`/api/v1/report/${id}`);
    return response.data;
};

export const createReport = async (formData: FormData) => {
    try {
        const response = await api.post("/api/v1/report", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            const { data } = error.response;

            // Validasi field (errors berbentuk object)
            if (data.errors && typeof data.errors === "object") {
                throw {
                    type: "validation",
                    message: data.message || "Validasi gagal!",
                    errors: data.errors,
                };
            }

            // Error umum (errors berbentuk string)
            if (data.errors && typeof data.errors === "string") {
                throw {
                    type: "general",
                    message: data.errors,
                };
            }

            // Error fallback
            throw {
                type: "general",
                message: data.message || "Terjadi kesalahan!",
            };
        }

        // Error koneksi/server down
        throw {
            type: "network",
            message: "Tidak dapat terhubung ke server. Coba lagi nanti.",
        };
    }
};

export const updateReport = async (id: number, formData: FormData) => {
    try {
        const response = await api.put(`/api/v1/report/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            const { data } = error.response;

            // Validasi field (errors berbentuk object)
            if (data.errors && typeof data.errors === "object") {
                throw {
                    type: "validation",
                    message: data.message || "Validasi gagal!",
                    errors: data.errors,
                };
            }

            // Error umum (errors berbentuk string)
            if (data.errors && typeof data.errors === "string") {
                throw {
                    type: "general",
                    message: data.errors,
                };
            }

            // Error fallback
            throw {
                type: "general",
                message: data.message || "Terjadi kesalahan!",
            };
        }

        // Error koneksi/server down
        throw {
            type: "network",
            message: "Tidak dapat terhubung ke server. Coba lagi nanti.",
        };
    }
};

export const deleteReport = async (id: number) => {
    const response = await api.delete(`/api/v1/report/${id}`);
    return response.data;
};