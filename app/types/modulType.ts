export interface ModulItem {
  id: number;
  id_dibuat_oleh?: number;
  judul_modul: string;
  deskripsi: string;
  file_modul: string;
  logo_judul?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ModulFormData {
  judul_modul: string;
  deskripsi: string;
  file_modul?: File;
  logo_judul?: File;
}
