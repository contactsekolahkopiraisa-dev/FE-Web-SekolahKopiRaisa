import { AddressSearchResponse, ShippingCostResponse } from "../types/orderType";
import api from "./api";

export const fetchAllOrder = async () => {
  try {
    const response = await api.get("/api/v1/order");
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { data } = error.response;

      if (data?.errors && typeof data.errors === "object") {
        throw {
          type: "validation",
          message: data.message || "Validasi gagal!",
          errors: data.errors,
        };
      }

      throw {
        type: "general",
        message: data.message || "Gagal mengambil daftar pesanan!",
      };
    }

    throw {
      type: "network",
      message: "Tidak dapat menghubungi server",
    };
  }
};

export const fetchOrderById = async (id: number) => {
  try {
    const response = await api.get(`/api/v1/order/${id}/detail`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { data } = error.response;

      if (data?.errors && typeof data.errors === "object") {
        throw {
          type: "validation",
          message: data.message || "Validasi gagal!",
          errors: data.errors,
        };
      }

      throw {
        type: "general",
        message: data.message || "Gagal mengambil detail pesanan!",
      };
    }

    throw {
      type: "network",
      message: "Tidak dapat menghubungi server",
    };
  }
};

export const fetchMyOrder = async () => {
  try {
    const response = await api.get("/api/v1/order/my-order");
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { data } = error.response;

      if (data?.errors && typeof data.errors === "object") {
        throw {
          type: "validation",
          message: data.message || "Validasi gagal!",
          errors: data.errors,
        };
      }

      throw {
        type: "general",
        message: data.message || "Gagal membuat pesanan!",
      };
    }

    throw {
      type: "network",
      message: "Tidak dapat menghubungi server",
    };
  }
};

interface OrderItem {
  products_id: number;
  quantity: number;
  custom_note: string;
  fromCart: boolean;
}

interface CreateOrderPayload {
  items: OrderItem[];
  address: string;
  destination_id: number;
  destination_province: string;
  destination_city: string;
  destination_district: string;
  destination_subdistrict: string;
  destination_pos_code: string;
  paymentMethod: string;
  cost: string;
}

export const createOrder = async (data: CreateOrderPayload) => {
  try {
    const response = await api.post("/api/v1/order", data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { data } = error.response;

      if (data?.errors && typeof data.errors === "object") {
        throw {
          type: "validation",
          message: data.message || "Validasi gagal!",
          errors: data.errors,
        };
      }

      throw {
        type: "general",
        message: data.message || "Gagal membuat pesanan!",
      };
    }

    throw {
      type: "network",
      message: "Tidak dapat menghubungi server",
    };
  }
};

export const updateStatusOrder = async (id: number, status: string) => {
  try {
    const response = await api.put(`/api/v1/order/${id}/update-status`, {
      status,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { data } = error.response;

      if (data.errors && typeof data.errors === "object") {
        throw {
          type: "validation",
          message: data.message || "Validasi gagal!",
          errors: data.errors,
        };
      }

      if (data.errors && typeof data.errors === "string") {
        throw {
          type: "general",
          message: data.errors,
        };
      }

      throw {
        type: "general",
        message: data.message || "Terjadi kesalahan!",
      };
    }
    throw {
      type: "network",
      message: "Tidak dapat terhubung ke server. Coba lagi nanti.",
    };
  }
};

export const deletePartner = async (id: number) => {
  const response = await api.delete(`/api/v1/partner/${id}`);
  return response.data;
};

export const cancelOrder = async (orderId: number, reason: string) => {
  try {
    const response = await api.put(`/api/v1/order/${orderId}/cancel`, { reason });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { data } = error.response;

      if (data?.errors && typeof data.errors === "object") {
        throw {
          type: "validation",
          message: data.message || "Validasi gagal!",
          errors: data.errors,
        };
      }

      throw {
        type: "general",
        message: data.message || "Gagal membatalkan pesanan!",
      };
    }

    throw {
      type: "network",
      message: "Tidak dapat menghubungi server",
    };
  }
};

export const searchAddress = async (search: string): Promise<AddressSearchResponse> => {
  try {
    const response = await api.get(`/api/v1/order/search-address?search=${encodeURIComponent(search)}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { data } = error.response;

      if (data?.errors && typeof data.errors === "object") {
        throw {
          type: "validation",
          message: data.message || "Validasi gagal!",
          errors: data.errors,
        };
      }

      throw {
        type: "general",
        message: data.message || "Gagal mencari alamat!",
      };
    }

    throw {
      type: "network",
      message: "Tidak dapat menghubungi server",
    };
  }
}

export const searchCost = async (destinationId: number, weight: number): Promise<ShippingCostResponse> => {
  try {
    const formData = new FormData();
    formData.append('destination', destinationId.toString());
    formData.append('weight', weight.toString());

    const response = await api.post('/api/v1/order/search-cost', formData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { data } = error.response;

      if (data?.errors && typeof data.errors === "object") {
        throw {
          type: "validation",
          message: data.message || "Validasi gagal!",
          errors: data.errors,
        };
      }

      throw {
        type: "general",
        message: data.message || "Gagal menghitung biaya pengiriman!",
      };
    }

    throw {
      type: "network",
      message: "Tidak dapat menghubungi server",
    };
  }
}

