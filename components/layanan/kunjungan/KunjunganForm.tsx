import FormField from "../FormField";
import FileUpload from "../FileUpload";

interface KunjunganFormProps {
  formData: {
    penanggungjawab: string;
    jumlahPeserta: string;
    instansi: string;
    tanggalKunjungan: string;
    suratPengantarFile: File | null;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUpload: (field: string, file: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function KunjunganForm({
  formData,
  onInputChange,
  onFileUpload,
  onSubmit,
}: KunjunganFormProps) {
  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <form onSubmit={onSubmit} className="space-y-6">
          <FormField
            label="Jenis Layanan"
            name="jenisLayanan"
            type="text"
            value="Kunjungan"
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

          <FormField
            label="Tanggal Kunjungan"
            name="tanggalKunjungan"
            type="date"
            value={formData.tanggalKunjungan}
            onChange={onInputChange}
          />

          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Upload Dokumen
            </h3>

            <div className="mb-4">
              <FileUpload
                label="Surat Permohonan / Surat Tugas"
                onFileChange={(file) =>
                  onFileUpload("suratPengantarFile", file)
                }
                file={formData.suratPengantarFile}
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
