export interface SubKegiatan {
  id: number;
  id_kegiatan: number;
  nama_sub_kegiatan: string;
  jam_durasi?: number | null;
  deskripsi: string;
}

export interface Kegiatan {
  id: number;
  nama_kegiatan: string;
  deskripsi: string;
}

export interface DetailKonfigurasi {
  id: number;
  id_konfigurasi_layanan: number;
  id_kegiatan: number;
  id_sub_kegiatan: number;
  urutan_ke: number;
  kegiatan: Kegiatan;
  subKegiatan: SubKegiatan;
}

export interface KonfigurasiLayanan {
  id: number;
  id_jenis_layanan: number;
  versi_konfig: string;
  hash_konfigurasi: string;
  is_active: boolean;
  catatan: string;
  created_at: string;
  detailKonfigurasis: DetailKonfigurasi[];
}

export interface JenisLayananItem {
  id: number;
  nama_jenis_layanan: string;
  deskripsi_singkat: string;
  deskripsi_lengkap: string;
  estimasi_waktu?: string;
  id_target_peserta: number;
  image: string;
  created_at?: string;
  updated_at?: string;
  targetPeserta?: TargetPesertaItem;
  konfigurasiLayanans?: KonfigurasiLayanan[];
}

export interface TargetPesertaItem {
  id: number;
  nama_target: string;
  created_at?: string;
  updated_at?: string;
}

export interface JenisLayananFormData {
  nama: string;
  deskripsi_singkat: string;
  deskripsi_lengkap: string;
  durasi?: string;
  id_target_peserta: number;
  image?: File;
}
