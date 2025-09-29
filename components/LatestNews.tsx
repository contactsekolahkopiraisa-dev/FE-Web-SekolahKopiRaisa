import Link from "next/link";
import Image from "next/image";

interface Props {
  items: { id: number; title: string; image: string; created_at: string }[];
}

const formatFullDate = (dateString: string): string => {
  const date = new Date(dateString);
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${dayName}, ${day} ${month} ${year} ${hours}:${minutes}`;
};

export default function LatestNews({ items }: Props) {
  return (
    <div>
      <h3 className="text-lg font-medium">Berita Terbaru</h3>
      <div className="w-20 h-[3px] bg-primary mb-4"></div>
      <div className="space-y-4">
        {items.map((item) => (
          <Link href={`/activity/${item.id}`} key={item.id}>
            <div className="flex items-start gap-4 cursor-pointer hover:bg-gray-100 p-2 rounded-lg">
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="flex flex-col">
                <p className="text-xs">{item.title}</p>
                <p className="text-xs text-gray-500">
                  {formatFullDate(item.created_at)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
