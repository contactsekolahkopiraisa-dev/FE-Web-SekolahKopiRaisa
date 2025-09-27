import { Partner } from "./partnerType";

export interface ProductItem {
  id?: number;
  name?: string;
  price?: number;
  description?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  stock?: number;
  inventory?: {
    stock?: number;
  }
  partner?: {
    id?: number;
    name?: string;
    owner_name?: string;
    phone_number?: string;
  }
  sold?: number;
  weight?: number; // Tambahkan berat produk
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onView?: (id: number) => void;
}

// export interface ProductApi {
//   id?: number;
//   name?: string;
//   price?: number;
//   description?: string;
//   image?: string;
//   weight?: number;
//   partner_id?: number; // Tambahkan partner_id yang ada di response
//   created_at?: string; // Ubah dari createdAt ke created_at (snake_case)
//   updated_at?: string; // Ubah dari updatedAt ke updated_at (snake_case)
//   inventory?: {
//     stock?: number;
//   }
//   partner?: Partner;
//   partnerName?: string;
//   sold?: number;
// }