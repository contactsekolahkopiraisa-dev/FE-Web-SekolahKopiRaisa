"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { updatePartner, fetchPartnerById } from "@/app/utils/partner";
import Popup from "@/components/Popup";
import ConfirmModal from "@/components/ConfirmModal";

export default function CreatePartnerPage() {
  // State to manage partner data
  const [partner, setPartner] = useState({
    name: "",
    owner_name: "",
    phone_number: "",
    // address: "",
  });

  const params = useParams();
  const partnerId = params?.id;

  const [errors, setErrors] = useState<Record<string, string>>({});

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error">("success");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const router = useRouter();

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setPartner((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for the field being edited
    if (errors[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await updatePartner(Number(partnerId), partner);

      console.log("RESPONSE:", response);

      if (response && response.message) {
        sessionStorage.setItem(
          "popup",
          JSON.stringify({
            message: response.message,
            type: "success",
          })
        );
        router.push("/admin/partner");
      }
    } catch (error: any) {
      if (error.type === "validation") {
        setErrors(error.errors);
        setShowConfirmModal(false);
      } else {
        console.error("Error:", error);
        setMessage(error.message || "Terjadi kesalahan saat menyimpan mitra.");
        setPopupType("error");
        setShowPopup(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const loadPartner = async () => {
      if (!partnerId) return;
      try {
        const response = await fetchPartnerById(Number(partnerId));
        const data = response.data;

        setPartner({
          name: data.namePartner || "",
          owner_name: data.ownerPartner || "",
          phone_number: data.phoneNumberPartner || "",
          // address: data.address || "",
        });
      } catch (error) {
        console.error("Error fetching partner data:", error);
        setMessage("Gagal memuat data mitra.");
        setPopupType("error");
        setShowPopup(true);
      }
    };
    loadPartner();
  }, [partnerId]);

  return (
    <div className=" mx-auto bg-tertiary p-6 rounded-xl shadow-lg">
      {showPopup && (
        <Popup
          message={message}
          type={popupType}
          onClose={() => setShowPopup(false)}
        />
      )}
      <ConfirmModal
        title="Simpan Perubahan"
        description="Apakah Anda yakin ingin mengubah mitra? Pastikan informasi yang Anda masukkan sudah benar."
        isOpen={showConfirmModal}
        isSubmitting={isSubmitting}
        onClose={() => {
          setShowConfirmModal(false);
        }}
        onConfirm={handleSubmit}
      />
      <h1 className="text-lg font-medium mb-4">Edit Mitra / Partner</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Partner Form */}
        <form onSubmit={handleSubmit} className="w-full text-sm">
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Mitra / Partner
            </label>
            <input
              type="text"
              name="name"
              value={partner.name}
              onChange={handleInputChange}
              className="w-full p-1.5 px-5 border border-gray-300 rounded-xl"
              placeholder="Nama Mitra / Partner"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Pemilik
            </label>
            <input
              type="text"
              name="owner_name"
              value={partner.owner_name}
              onChange={handleInputChange}
              className="w-full p-1.5 px-5 border border-gray-300 rounded-xl"
              placeholder="Nama Pemilik"
            />
            {errors.owner_name && (
              <p className="text-sm text-red-600 mt-1">{errors.owner_name}</p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              No. Telepon
            </label>
            <input
              type="number"
              name="phone_number"
              value={partner.phone_number}
              onChange={handleInputChange}
              className="w-full p-1.5 px-5 border border-gray-300 rounded-xl"
              placeholder="081234567890"
            />
            {errors.phone_number && (
              <p className="text-sm text-red-600 mt-1">{errors.phone_number}</p>
            )}
          </div>

          {/* <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Alamat
                        </label>
                        <textarea
                            name="address"
                            value={partner.address}
                            onChange={handleInputChange}
                            className="w-full p-1.5 px-5 border border-gray-300 rounded-xl"
                            placeholder="Jl. Raya No. 123, Kelurahan, Kecamatan, Kota, Provinsi, Kode Pos"
                            rows={3}
                        />
                        {errors.address && (
                            <p className="text-sm text-red-600 mt-1">
                                {errors.address}
                            </p>
                        )}
                    </div> */}

          <div className="flex justify-end">
            <button
              type="button"
              // disabled={isSubmitting}
              onClick={() => setShowConfirmModal(true)}
              className="cursor-pointer mt-4 bg-primary text-white py-2 px-3 text-sm font-medium rounded-xl hover:-translate-y-1 duration-150 ease-in flex justify-center items-center gap-2 disabled:opacity-50"
            >
              Simpan Mitra / Partner
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
