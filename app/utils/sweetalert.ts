import Swal from "sweetalert2";

export const confirmDeactivateService = (serviceName: string) => {
  return Swal.fire({
    title: "Apakah Anda yakin ingin menonaktifkan kategori layanan ini?",
    html: `
      <p style="color: #6b7280; font-size: 14px; margin-top: 8px;">
        Menonaktifkan layanan akan membuat kategori ini tidak lagi ditampilkan pada halaman pengguna (customer)
      </p>
    `,
    showCancelButton: true,
    confirmButtonText: "Yakin",
    cancelButtonText: "Batal",
    reverseButtons: true,
    customClass: {
      popup: "rounded-2xl",
      title: "text-lg font-semibold text-gray-900",
      htmlContainer: "text-sm",
      confirmButton:
        "px-6 py-2.5 bg-amber-900 text-white rounded-lg hover:bg-amber-950 font-medium transition-colors",
      cancelButton:
        "px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors",
      actions: "gap-3",
    },
    buttonsStyling: false,
  });
};

export const confirmActivateService = (serviceName: string) => {
  return Swal.fire({
    title: "Apakah Anda yakin ingin mengaktifkan kategori layanan ini?",
    html: `
      <p style="color: #6b7280; font-size: 14px; margin-top: 8px;">
        Mengaktifkan layanan akan membuat kategori ini ditampilkan kembali pada halaman pengguna (customer)
      </p>
    `,
    showCancelButton: true,
    confirmButtonText: "Yakin",
    cancelButtonText: "Batal",
    reverseButtons: true,
    customClass: {
      popup: "rounded-2xl",
      title: "text-lg font-semibold text-gray-900",
      htmlContainer: "text-sm",
      confirmButton:
        "px-6 py-2.5 bg-amber-900 text-white rounded-lg hover:bg-amber-950 font-medium transition-colors",
      cancelButton:
        "px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors",
      actions: "gap-3",
    },
    buttonsStyling: false,
  });
};

export const showSuccessAlert = (message: string) => {
  return Swal.fire({
    title: "Berhasil!",
    text: message,
    icon: "success",
    confirmButtonText: "OK",
    customClass: {
      popup: "rounded-2xl",
      confirmButton:
        "px-6 py-2.5 bg-amber-900 text-white rounded-lg hover:bg-amber-950 font-medium",
    },
    buttonsStyling: false,
  });
};

export const showErrorAlert = (message: string) => {
  return Swal.fire({
    title: "Gagal!",
    text: message,
    icon: "error",
    confirmButtonText: "OK",
    customClass: {
      popup: "rounded-2xl",
      confirmButton:
        "px-6 py-2.5 bg-amber-900 text-white rounded-lg hover:bg-amber-950 font-medium",
    },
    buttonsStyling: false,
  });
};