import FormField from "../FormField";
import KegiatanSection from "../KegiatanSection";
import FileUpload from "../FileUpload";

interface PelatihanFormProps {
  formData: {
    penanggungjawab: string;
    jumlahPeserta: string;
    instansi: string;
    tanggalMulai: string;
    tanggalSelesai: string;
    kegiatan: string[];
    suratPermohonanFile: File | null;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKegiatanChange: (kegiatan: string) => void;
  onFileUpload: (field: string, file: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function PelatihanForm({
  formData,
  onInputChange,
  onKegiatanChange,
  onFileUpload,
  onSubmit,
}: PelatihanFormProps) {
  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <form onSubmit={onSubmit} className="space-y-6">
          <FormField
            label="Jenis Layanan"
            name="jenisLayanan"
            type="text"
            value="Pelatihan"
            onChange={onInputChange}
            readOnly={true}
          />

          <FormField
            label="Penanggungjawab"
            name="penanggungjawab"
            type="text"
            value={formData.penanggungjawab}
            onChange={onInputChange}
            placeholder="Masukkan nama penanggungjawab"
          />

          <FormField
            label="Jumlah Peserta"
            name="jumlahPeserta"
            type="number"
            value={formData.jumlahPeserta}
            onChange={onInputChange}
            placeholder="Masukkan jumlah peserta"
          />

          <FormField
            label="Instansi"
            name="instansi"
            type="text"
            value={formData.instansi}
            onChange={onInputChange}
            placeholder="Asal Instansi (Sekolah/Universitas)"
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              label="Tanggal Mulai"
              name="tanggalMulai"
              type="date"
              value={formData.tanggalMulai}
              onChange={onInputChange}
            />

            <FormField
              label="Tanggal Selesai"
              name="tanggalSelesai"
              type="date"
              value={formData.tanggalSelesai}
              onChange={onInputChange}
            />
          </div>

          <KegiatanSection
            kegiatan={formData.kegiatan}
            onKegiatanChange={onKegiatanChange}
          />

          <div className="bg-gray-100 p-6 rounded-lg">
            <div>
              <FileUpload
                label="Surat Permohonan"
                onFileChange={(file) =>
                  onFileUpload("suratPermohonanFile", file)
                }
                file={formData.suratPermohonanFile}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-amber-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-amber-900 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
