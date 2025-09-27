"use client";
import { useEffect, useState } from "react";
import ActivitySlider from "../components/ActivitySlider";
import ActivityCard from "../components/ActivityCard";
import Footer from "../components/Footer";
import { fetchAllActivity } from "../utils/activity";
import ActivityUserSkeleton from "../components/ActivityUserSkeleton";
import { useRouter } from "next/navigation";

interface ActivityItemApi {
  id: number;
  title: string;
  content: string;
  image: string;
  time: string;
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

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityItemApi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleCardClick = (id: number) => {
    router.push(`/activity/${id}`);
  };

  useEffect(() => {
    const getActivities = async () => {
      try {
        setLoading(true);
        const response = await fetchAllActivity();
        const rawData = response.data;

        const filtered = rawData
          .filter((item: any) =>
            item.newsMedia?.some((media: any) =>
              media.media_type?.startsWith("image")
            )
          )
          .map((item: any) => {
            const imageMedia = item.newsMedia.find((media: any) =>
              media.media_type?.startsWith("image")
            );

            return {
              id: item.id,
              title: item.title,
              content: item.content,
              image: imageMedia.media_url, // Gambar default
              time: formatFullDate(item.created_at),
            };
          })
          .filter(Boolean); // buang null

        setActivities(filtered);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch activities:", err);
        setError("Failed to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getActivities();
  }, []);

  // Map activities for slider (first 5 items)
  const sliderItems = activities.slice(0, 4).map((item) => ({
    id: item.id,
    image: item.image,
    title: item.title,
  }));

  // Map activities for cards (all items)
  const cardItems = activities.map((item) => ({
    id: item.id,
    image: item.image,
    title: item.title,
    time: item.time,
    onClick: () => handleCardClick(item.id),
  }));

  if (loading) {
    return <ActivityUserSkeleton />;
  }

  if (error) {
    return (
      <div className="px-4 md:px-8 py-4 max-w-400 mx-auto">
        <div className="mt-20 text-center text-red-500">
          <p>{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary">
      <div className="p-4 py-4 max-w-400 mx-auto">
        <section className="mt-20">
          {sliderItems.length > 0 ? (
            <ActivitySlider sliderItems={sliderItems} />
          ) : (
            <div className="text-center py-8">
              No news available for slider.
            </div>
          )}
        </section>
        <section className="my-8 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-medium mb-4">
            Berita Terbaru
          </h2>
          {cardItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <ActivityCard cardItems={cardItems} />
            </div>
          ) : (
            <div className="text-center py-8">No news available.</div>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
}
