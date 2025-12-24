import FormField from "../FormField";
import KegiatanSection from "../KegiatanSection";
import FileUpload from "../FileUpload";

interface MagangFormProps {
  formData: {
    namaPeserta: string;
    namaNIM: string;
    fakultas: string;
    prodi: string;
    instansi: string;
    tanggalMulai: string;
    tanggalSelesai: string;
    kegiatan: string[];
    proposalFile: File | null;
    suratPengantarFile: File | null;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKegiatanChange: (kegiatan: string) => void;
  onFileUpload: (field: string, file: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function MagangForm({
  formData,
  onInputChange,
  onKegiatanChange,
  onFileUpload,
  onSubmit,
}: MagangFormProps) {
  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <form onSubmit={onSubmit} className="space-y-6">
          <FormField
            label="Jenis Layanan"
            name="jenisLayanan"
            type="text"
            value="Magang"
            onChange={onInputChange}
            readOnly={true}
          />

          <FormField
            label="Nama Peserta"
            name="namaPeserta"
            type="text"
            value={formData.namaPeserta}
            onChange={onInputChange}
            placeholder="Masukkan nama lengkap"
          />

          <FormField
            label="NIM / NIS"
            name="namaNIM"
            type="text"
            value={formData.namaNIM}
            onChange={onInputChange}
            placeholder="Masukkan NIM / NIS"
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
            label="Fakultas (Opsional)"
            name="fakultas"
            type="text"
            value={formData.fakultas}
            onChange={onInputChange}
            placeholder="Masukkan nama fakultas (kosongkan jika sekolah)"
          />

          <FormField
            label="Prodi / Jurusan"
            name="prodi"
            type="text"
            value={formData.prodi}
            onChange={onInputChange}
            placeholder="Masukkan nama prodi atau jurusan"
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
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Upload Dokumen
            </h3>

            <div className="mb-4">
              <FileUpload
                label="Proposal / Surat Permohonan"
                onFileChange={(file) => onFileUpload("proposalFile", file)}
                file={formData.proposalFile}
              />
            </div>

            <div>
              <FileUpload
                label="Surat Pengantar"
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
