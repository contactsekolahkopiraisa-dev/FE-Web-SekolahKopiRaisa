import { FileText, Upload } from "lucide-react";

interface FileUploadProps {
  label: string;
  onFileChange: (file: File | null) => void;
  accept?: string;
  file?: File | null;
}

export default function FileUpload({ label, onFileChange, accept = ".pdf,.doc,.docx", file }: FileUploadProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg">
      <div className="flex items-center space-x-3 overflow-hidden">
        <FileText className="text-gray-500" size={20} />
        <div className="flex flex-col">
          <span className="text-gray-700">{label}</span>
          {file && (
            <span className="text-xs text-gray-500 truncate max-w-[420px]">{file.name}</span>
          )}
        </div>
      </div>
      <label className="flex items-center space-x-2 bg-amber-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-amber-700 transition-colors">
        <Upload size={16} />
        <span>Unggah File</span>
        <input
          type="file"
          accept={accept}
          onChange={(e) => onFileChange(e.target.files?.[0] || null)}
          className="hidden"
        />
      </label>
    </div>
  );
}
