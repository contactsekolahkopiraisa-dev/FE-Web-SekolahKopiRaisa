export interface ModulItem {
  id: number;
  id_dibuat_oleh?: number;
  judul_modul: string;
  deskripsi: string;
  file_modul: string;
  foto_sampul: string | null;
  logo_judul?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ModulFormData {
  judul_modul: string;
  deskripsi: string;
  file_modul?: File;
  foto_sampul?: File;
  logo_judul?: File;
}
