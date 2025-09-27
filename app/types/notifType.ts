export interface NotificationUser {
  id: number;
  name: string;
  image: string | null;
  email: string;
  password: string;
  phone_number: string;
  admin: boolean;
  verified: boolean;
  createdAt: string;
  updated_at: string;
  google_id: string | null;
}

export interface NotificationItem {
  id: number;
  name: string;
  viewed: boolean;
  description: string;
  user_id: number;
  order_id: number;
  created_at: string;
  updated_at: string;
  user: NotificationUser;
}

export interface NotificationResponse {
  message: string;
  data: NotificationItem[];
}