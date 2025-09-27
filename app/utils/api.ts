// utils/api.ts
import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // jika pakai cookie/session
});

export default api;
