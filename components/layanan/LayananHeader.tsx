interface LayananHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function LayananHeader({
  title = "Layanan",
  subtitle = "Layanan yang bisa diajukan di Sekolah Kopi Raisa",
}: LayananHeaderProps) {
  return (
    <div className="text-center pt-32 pb-12">
      <h1 className="text-5xl font-bold text-gray-900 mb-3">
        {title}
      </h1>
      <p className="text-gray-500 text-sm">
        {subtitle}
      </p>
    </div>
  );
}
