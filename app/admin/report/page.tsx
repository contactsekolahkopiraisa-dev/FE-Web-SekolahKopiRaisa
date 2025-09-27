"use client";

import ConfirmModal from "@/app/components/ConfirmModal";
import Popup from "@/app/components/Popup";
import { Plus } from "lucide-react";
import { use, useEffect, useState } from "react";
import ReportListAdmin, {
    ReportListAdminProps,
} from "@/app/components/ReportListAdmin";
import { useRouter } from "next/navigation";

export default function Report() {
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [popupType, setPopupType] = useState<"success" | "error">("success");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [reportToDelete, setReportToDelete] = useState<number | null>(null);
    const [data, setData] = useState<ReportListAdminProps[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    const fetchAllReport = async () => {
        // Simulate fetching reports from an API
        return {
            data: [
                {
                    id: 1,
                    title: "Laporan Kegiatan P4S",
                    city: "Kota A",
                    date: "2023-10-01",
                    eventType: "Pelatihan Pertanian",
                    image: "/images/report1.jpg",
                },
                {
                    id: 2,
                    title: "Laporan Kegiatan P4S",
                    city: "Kota B",
                    date: "2023-10-02",
                    eventType: "Pameran Hasil Pertanian",
                    image: "/images/report2.jpg",
                },
            ],
        };
    };

    const handleAddReport = () => {
        router.push("/admin/report/create");
    };

    const handleReportClick = (id: number) => {
        router.push(`/admin/report/detail/${id}`);
    };

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
        const getReports = async () => {
            try {
                setLoading(true);
                const response = await fetchAllReport();
                const rawData = response.data;
                const formattedData = rawData.map((report: any) => ({
                    id: report.id,
                    title: report.title,
                    city: report.city,
                    date: report.date,
                    eventType: report.eventType,
                    image: report.image,
                }));
                setData(formattedData);
            } catch (error) {
                console.error("Failed to fetch reports:", error);
                setError("Gagal memuat laporan. Silakan coba lagi.");
            } finally {
                setLoading(false);
            }
        };
        getReports();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-2 sm:px-3 py-2">
            {/* {showPopup && (
            <Popup
                message={message}
                type={popupType}
                onClose={() => setShowPopup(false)}
            />
            )}
            <ConfirmModal
            title="Yakin Menghapus Laporan?"
            description="Tindakan ini tidak dapat dibatalkan. Laporan yang dihapus akan secara permanen terhapus dari sistem."
            isOpen={showConfirmModal}
            onClose={() => {
                setShowConfirmModal(false);
                setReportToDelete(null);
            }}
            onConfirm={() => {
                if (reportToDelete !== null) {
                // handleDeleteReport(reportToDelete);
                }
                setShowConfirmModal(false);
                setReportToDelete(null);
            }}
            /> */}
            <div className="flex flex-col sm:flex-row justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
                <h1 className="text-lg font-medium text-gray-800">
                    Daftar Laporan P4S
                </h1>
                <input
                    type="text"
                    name="Link Laporan"
                    // value={report.title}
                    // onChange={handleInputChange}
                    className="w-md p-1.5 px-3 border border-gray-300 rounded-xl"
                    placeholder="Link Laporan"
                />
                <button
                    className="cursor-pointer bg-amber-950 text-white px-3 py-1.5 rounded-xl flex items-center gap-1 hover:-translate-y-1 duration-150 ease-in text-sm w-full sm:w-auto justify-center"
                    onClick={handleAddReport}
                >
                    <Plus size={20} />
                    <span>Buat Laporan Baru</span>
                </button>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {data.map((report: ReportListAdminProps, index: number) => (
                    <button
                        key={index}
                        className="text-left"
                        onClick={() =>
                            report.id !== undefined &&
                            handleReportClick(report.id)
                        }
                        style={{
                            all: "unset",
                            cursor: "pointer",
                            display: "block",
                        }}
                    >
                        <ReportListAdmin
                            id={report.id}
                            title={report.title}
                            city={report.city}
                            date={report.date}
                            eventType={report.eventType}
                            image={report.image}
                        />
                    </button>
                ))}
                {loading && (
                    <div className="col-span-full text-center text-gray-500">
                        Memuat laporan...
                    </div>
                )}
                {error && (
                    <div className="col-span-full text-center text-red-500">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}
