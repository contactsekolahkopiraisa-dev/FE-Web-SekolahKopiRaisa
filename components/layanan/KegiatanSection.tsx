interface KegiatanSectionProps {
  kegiatan: string[];
  onKegiatanChange: (kegiatan: string) => void;
}

const kegiatanOptions = [
  "Pengenalan Tanaman Kopi",
  "Pembibitan",
  "Pemeliharaan",
  "Pasca Panen",
  "Persiapan Lahan",
  "Penanaman",
  "Panen"
];

export default function KegiatanSection({ kegiatan, onKegiatanChange }: KegiatanSectionProps) {
  return (
    <div className="bg-gray-100 p-6 rounded-lg">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Kegiatan</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {kegiatanOptions.map((kegiatanOption, index) => (
          <label key={index} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={kegiatan.includes(kegiatanOption)}
              onChange={() => onKegiatanChange(kegiatanOption)}
              className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
            />
            <span className="text-gray-700">{kegiatanOption}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
