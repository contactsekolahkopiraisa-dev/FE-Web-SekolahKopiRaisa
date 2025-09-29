"use client";

import ActivityAdminSkeleton from "@/components/activity/ActivityAdminSkeleton";
import ActivityListAdmin, {
  ActivityListProps,
} from "@/components/activity/ActivityListAdmin";
import ConfirmModal from "@/components/ConfirmModal";
import Popup from "@/components/Popup";
import { deleteActivity, fetchAllActivity } from "@/app/utils/activity";
import { ChevronDown, Funnel, FunnelPlus, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Activity() {
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error">("success");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [activityToDelete, setActivityToDelete] = useState<number | null>(null);
  const [activities, setActivities] = useState<ActivityListProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [sortOption, setSortOption] = useState("newest");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // 8 items per page

  const sortActivities = (data: typeof activities, option: string) => {
    const sorted = [...data];
    if (option === "newest") {
      sorted.sort(
        (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
      );
    } else if (option === "oldest") {
      sorted.sort(
        (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
      );
    } else if (option === "az") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    return sorted;
  };

  // Pagination calculations
  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentActivities = activities.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handleAddActivity = () => {
    router.push("/admin/activity/create");
  };

  const handleDeleteActivity = async (id: number) => {
    try {
      const response = await deleteActivity(id);
      if (response) {
        setActivities((prev) => prev.filter((a) => a.id !== id));
        setMessage(response.message);
        setPopupType("success");
        setShowPopup(true);
      }
    } catch (error: any) {
      setMessage(error.message || "Terjadi kesalahan saat menghapus.");
      setPopupType("error");
      setShowPopup(true);
    }
  };

  const handleEditActivity = (id: number) => {
    router.push(`/admin/activity/edit/${id}`);
  };

  const handleViewActivity = (id: number) => {
    router.push(`/admin/activity/${id}`);
  };

  const formatUpload = (dateString: string): string => {
    try {
      const date = new Date(dateString);

      // Format to Indonesian style date: DD Month YYYY
      const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
      };

      return date.toLocaleDateString("id-ID", options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // Return original string if there's an error
    }
  };

  useEffect(() => {
    setActivities((prev) => sortActivities(prev, sortOption));
  }, [sortOption]);

  // Reset to page 1 when sort option changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortOption]);

  // Reset to page 1 when activities change
  useEffect(() => {
    setCurrentPage(1);
  }, [activities.length]);

  useEffect(() => {
    const popupData = sessionStorage.getItem("popup");
    if (popupData) {
      const { message, type } = JSON.parse(popupData);
      setMessage(message);
      setPopupType(type);
      setShowPopup(true);
      sessionStorage.removeItem("popup");
    }
  }, []);

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
            const imageMedia = item.newsMedia.find(
              (media: any) => media.isThumbnail
            );

            return {
              id: item.id,
              title: item.title,
              content: item.content,
              image: imageMedia?.media_url || "/assets/flower-top.png",
              time: formatUpload(item.created_at),
            };
          })
          .filter(Boolean); // buang null

        setActivities(filtered);
        console.log("Activities fetched:", filtered);
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

  return (
    <div className="mx-auto">
      {showPopup && (
        <Popup
          message={message}
          type={popupType}
          onClose={() => setShowPopup(false)}
        />
      )}
      <ConfirmModal
        title="Yakin Hapus Kegiatan?"
        description="Tindakan ini tidak dapat dibatalkan. Kegiatan yang dihapus akan secara permanen terhapus dari sistem."
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setActivityToDelete(null);
        }}
        onConfirm={() => {
          if (activityToDelete !== null) {
            handleDeleteActivity(activityToDelete);
          }
          setShowConfirmModal(false);
          setActivityToDelete(null);
        }}
      />

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4 md:mb-6">
        <h1 className="text-lg font-medium text-gray-800">
          Daftar Berita
          {!loading && activities.length > 0 && (
            <span className="text-sm text-gray-500 ml-2">
              ({activities.length} berita)
            </span>
          )}
        </h1>

        <div className="flex items-center gap-4">
          <button
            className="bg-amber-950 text-white px-3 py-2 rounded-xl flex items-center gap-1 hover:-translate-y-1 duration-150 ease-in text-sm"
            onClick={handleAddActivity}
          >
            <Plus size={18} />
            <span>Tambah Berita</span>
          </button>

          <div className="relative hover:-translate-y-1 duration-150 ease-in">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="appearance-none border border-gray-500 rounded-xl px-3 py-2 text-sm pr-8"
            >
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
              <option value="az">Judul A-Z</option>
            </select>
            <FunnelPlus
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
              size={18}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-3 md:space-y-4">
        {loading ? (
          <>
            <ActivityAdminSkeleton />
            <ActivityAdminSkeleton />
            <ActivityAdminSkeleton />
          </>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8">Tidak ada berita tersedia</div>
        ) : (
          currentActivities.map((item) => (
            <ActivityListAdmin
              key={item.id}
              {...item}
              onDelete={(id) => {
                setActivityToDelete(id);
                setShowConfirmModal(true);
              }}
              onEdit={handleEditActivity}
              onView={handleViewActivity}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && activities.length > 0 && totalPages > 1 && (
        <div className="flex flex-col items-center space-y-4 mt-8">
          {/* Pagination Info */}
          <div className="text-sm text-gray-600">
            Menampilkan {startIndex + 1}-{Math.min(endIndex, activities.length)} dari {activities.length} berita
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center space-x-1">
            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              disabled={currentPage === 1}
              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span key={index} className="px-3 py-2 text-gray-500">
                    ...
                  </span>
                ) : (
                  <button
                    key={index}
                    onClick={() => goToPage(page as number)}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm ${
                      currentPage === page
                        ? "bg-amber-950 text-white border-amber-950"
                        : "border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={goToNext}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}