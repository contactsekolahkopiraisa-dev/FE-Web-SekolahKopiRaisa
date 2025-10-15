import FormField from "../FormField";
import KegiatanSection from "../KegiatanSection";
import FileUpload from "../FileUpload";

interface PKLFormProps {
  formData: {
    namaPeserta: string;
    namaNIM: string;
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

export default function PKLForm({
  formData,
  onInputChange,
  onKegiatanChange,
  onFileUpload,
  onSubmit
}: PKLFormProps) {
  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <form onSubmit={onSubmit} className="space-y-6">
          
          {/* Jenis Layanan */}
          <FormField
            label="Jenis Layanan"
            name="jenisLayanan"
            type="text"
            value="Praktek Kerja Lapangan"
            onChange={onInputChange}
            readOnly={true}
          />

          {/* Nama Peserta */}
          <FormField
            label="Nama Peserta"
            name="namaPeserta"
            type="text"
            value={formData.namaPeserta}
            onChange={onInputChange}
            placeholder="Masukkan nama lengkap"
          />

           {/* NIM */}
          <FormField
            label="NIM / NIS"
            name="nim"
            type="text"
            value={formData.namaNIM}
            onChange={onInputChange}
            placeholder="Masukkan NIM / NIS"
          />

          {/* Instansi */}
          <FormField
            label="Instansi"
            name="instansi"
            type="text"
            value={formData.instansi}
            onChange={onInputChange}
            placeholder="Asal Instansi (Sekolah/Universitas)"
          />

          {/* Tanggal Mulai */}
          <FormField
            label="Tanggal Mulai"
            name="tanggalMulai"
            type="date"
            value={formData.tanggalMulai}
            onChange={onInputChange}
          />

          {/* Tanggal Selesai */}
          <FormField
            label="Tanggal Selesai"
            name="tanggalSelesai"
            type="date"
            value={formData.tanggalSelesai}
            onChange={onInputChange}
          />

          {/* Kegiatan Section */}
          <KegiatanSection
            kegiatan={formData.kegiatan}
            onKegiatanChange={onKegiatanChange}
          />

          {/* Upload Dokumen Section */}
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Upload Dokumen</h3>
            
            {/* Proposal File */}
            <div className="mb-4">
              <FileUpload
                label="Proposal / Surat Permohonan"
              onFileChange={(file) => onFileUpload('proposalFile', file)}
              file={formData.proposalFile}
              />
            </div>

            {/* Surat Pengantar File */}
            <div>
              <FileUpload
                label="Surat Pengantar"
              onFileChange={(file) => onFileUpload('suratPengantarFile', file)}
              file={formData.suratPengantarFile}
              />
            </div>
          </div>

          {/* Submit Button */}
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
