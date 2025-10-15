import FormField from "../FormField";
import FileUpload from "../FileUpload";

interface UndanganFormProps {
  formData: {
    namaKegiatan: string;
    instansi: string;
    tanggalKegiatan: string;
    tempatKegiatan: string;
    proposalFile: File | null;
    suratPermohonanFile: File | null;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUpload: (field: string, file: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function UndanganForm({
  formData,
  onInputChange,
  onFileUpload,
  onSubmit
}: UndanganFormProps) {
  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <form onSubmit={onSubmit} className="space-y-6">
          <FormField
            label="Jenis Layanan"
            name="jenisLayanan"
            type="text"
            value="Undangan Narasumber"
            onChange={onInputChange}
            readOnly={true}
          />

          <FormField
            label="Nama Kegiatan"
            name="namaKegiatan"
            type="text"
            value={formData.namaKegiatan}
            onChange={onInputChange}
            placeholder="Masukkan nama Kegiatan"
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
            label="Tanggal Kegiatan"
            name="tanggalKegiatan"
            type="date"
            value={formData.tanggalKegiatan}
            onChange={onInputChange}
          />

           <FormField
            label="Tempat Kegiatan"
            name="tempatKegiatan"
            type="text"
            value={formData.tempatKegiatan}
            onChange={onInputChange}
          />

          <div className="bg-gray-100 p-6 rounded-lg">
            <div>
              <FileUpload
                label="Proposal / Surat Permohonan"
                onFileChange={(file) => onFileUpload('proposalFile', file)}
                file={formData.proposalFile}
              />
            </div>
          </div> 

          <div className="bg-gray-100 p-6 rounded-lg">
            <div>
              <FileUpload
                label="Surat Permohonan"
                onFileChange={(file) => onFileUpload('suratPermohonanFile', file)}
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


