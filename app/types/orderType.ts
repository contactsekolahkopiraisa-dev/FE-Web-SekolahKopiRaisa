export interface OrderItem {
  products_id: number;
  quantity: number;
  custom_note: string;
  fromCart: boolean;
}

export interface CreateOrderPayload {
  items: OrderItem[];
  address: string;
  shipping_name: string;
  shipping_code: string;
  shipping_service: string;
  destination_id: number;
  destination_province: string;
  destination_city: string;
  destination_district: string;
  destination_subdistrict: string;
  destination_pos_code: string;
  cost: string;
  paymentMethod: string;
}

export interface AddressSuggestion {
  id: number;
  label: string;
  province_name: string;
  city_name: string;
  district_name: string;
  subdistrict_name: string;
  zip_code: string;
}

export interface ShippingCostResponse {
  data: {
    data: {
      name: string;
      code: string;
      service: string;
      cost: number;
    }[];
  };
}

export interface AddressSearchResponse {
  message: string;
  data: AddressSuggestion[];
}
