module.exports = {

"[project]/app/utils/layanan.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "acceptPengajuan": (()=>acceptPengajuan),
    "createLayanan": (()=>createLayanan),
    "fetchAllLayanan": (()=>fetchAllLayanan),
    "fetchLayananById": (()=>fetchLayananById),
    "formatDate": (()=>formatDate),
    "getSlugFromJenisLayanan": (()=>getSlugFromJenisLayanan),
    "getStatusColor": (()=>getStatusColor),
    "rejectPengajuan": (()=>rejectPengajuan),
    "submitLogbook": (()=>submitLogbook),
    "updateLogbook": (()=>updateLogbook),
    "updateStatusPelaksanaan": (()=>updateStatusPelaksanaan)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/api.ts [app-ssr] (ecmascript)");
;
const fetchAllLayanan = async (params)=>{
    try {
        const queryParams = new URLSearchParams();
        if (params?.include_jenis) queryParams.append("include_jenis", "true");
        if (params?.include_peserta) queryParams.append("include_peserta", "true");
        if (params?.include_mou) queryParams.append("include_mou", "true");
        if (params?.include_sertifikat) queryParams.append("include_sertifikat", "true");
        if (params?.include_laporan) queryParams.append("include_laporan", "true");
        if (params?.include_rejection) queryParams.append("include_rejection", "true");
        if (params?.include_pengajuan) queryParams.append("include_pengajuan", "true");
        if (params?.include_pelaksanaan) queryParams.append("include_pelaksanaan", "true");
        const url = `/api/v1/layanan${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
        console.log("Fetching layanan from:", url);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(url);
        console.log("Layanan response:", response.data);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || "Gagal mengambil data layanan");
    } catch (error) {
        console.error("Error fetching layanan:", error);
        throw new Error(error.response?.data?.message || error.message || "Gagal mengambil data layanan");
    }
};
const fetchLayananById = async (id, params)=>{
    try {
        const queryParams = new URLSearchParams();
        if (params?.include_jenis) queryParams.append("include_jenis", "true");
        if (params?.include_peserta) queryParams.append("include_peserta", "true");
        if (params?.include_mou) queryParams.append("include_mou", "true");
        if (params?.include_sertifikat) queryParams.append("include_sertifikat", "true");
        if (params?.include_laporan) queryParams.append("include_laporan", "true");
        if (params?.include_rejection) queryParams.append("include_rejection", "true");
        if (params?.include_pengajuan) queryParams.append("include_pengajuan", "true");
        if (params?.include_pelaksanaan) queryParams.append("include_pelaksanaan", "true");
        const url = `/api/v1/layanan/${id}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
        console.log("Fetching layanan detail from:", url);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(url);
        console.log("Layanan detail response:", response.data);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || "Gagal mengambil detail layanan");
    } catch (error) {
        console.error("Error fetching layanan detail:", error);
        throw new Error(error.response?.data?.message || error.message || "Gagal mengambil detail layanan");
    }
};
const createLayanan = async (formData)=>{
    try {
        // Debug isi FormData
        const debugEntries = {};
        formData.forEach((v, k)=>{
            debugEntries[k] = v instanceof File ? `File(name=${v.name}, size=${v.size})` : v;
        });
        console.log("Creating layanan with data:", debugEntries);
        // Biarkan axios/browser set Content-Type + boundary otomatis
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post("/api/v1/layanan", formData);
        console.log("Create layanan response:", response.data);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || "Gagal membuat layanan");
    } catch (error) {
        console.error("Error creating layanan:", error);
        console.error("Response status:", error?.response?.status);
        console.error("Response data:", error?.response?.data);
        console.error("Response headers:", error?.response?.headers);
        const serverMsg = error?.response?.data?.message || error?.response?.data?.error || JSON.stringify(error?.response?.data);
        throw new Error(serverMsg || error.message || "Gagal membuat layanan");
    }
};
const acceptPengajuan = async (id)=>{
    try {
        console.log("Accepting pengajuan:", id);
        // Backend route: PUT /api/v1/layanan/:id/accept-pengajuan
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].put(`/api/v1/layanan/${id}/accept-pengajuan`);
        console.log("Accept pengajuan response:", response.data);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || "Gagal menyetujui pengajuan");
    } catch (error) {
        console.error("Error accepting pengajuan:", error);
        throw new Error(error.response?.data?.message || error.message || "Gagal menyetujui pengajuan");
    }
};
const rejectPengajuan = async (id, alasan)=>{
    try {
        console.log("Rejecting pengajuan:", id, alasan);
        // Backend route: PUT /api/v1/layanan/:id/reject-pengajuan with body { alasan: "..." }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].put(`/api/v1/layanan/${id}/reject-pengajuan`, {
            alasan
        });
        console.log("Reject pengajuan response:", response.data);
        console.log("Reject pengajuan response.data.data:", response.data.data);
        console.log("Reject pengajuan response.data.data.layananRejection:", response.data.data?.layananRejection);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || "Gagal menolak pengajuan");
    } catch (error) {
        console.error("Error rejecting pengajuan:", error);
        throw new Error(error.response?.data?.message || error.message || "Gagal mengupdate status layanan");
    }
};
const submitLogbook = async (id, payload)=>{
    try {
        console.log("Submitting logbook for layanan:", id, payload);
        console.log("API URL:", `/api/v1/layanan/${id}/logbook`);
        // Backend uses PUT for both create and update logbook
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].put(`/api/v1/layanan/${id}/logbook`, payload);
        console.log("Submit logbook response:", response.data);
        // Handle different response formats
        if (response.data && (response.data.success || response.status === 200 || response.status === 201)) {
            return {
                success: true,
                message: response.data.message || "Logbook berhasil dikirim",
                data: response.data.data || response.data
            };
        }
        throw new Error(response.data?.message || "Gagal mengirim logbook");
    } catch (error) {
        console.error("Error submitting logbook:", error);
        console.error("Error response:", error.response);
        console.error("Error status:", error.response?.status);
        console.error("Error data:", error.response?.data);
        throw new Error(error.response?.data?.message || error.response?.data?.error || error.message || "Gagal mengirim logbook");
    }
};
const updateLogbook = async (id, payload)=>{
    try {
        console.log("Updating logbook for layanan:", id, payload);
        console.log("API URL:", `/api/v1/layanan/${id}/logbook`);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].put(`/api/v1/layanan/${id}/logbook`, payload);
        console.log("Update logbook response:", response.data);
        // Handle different response formats
        if (response.data && (response.data.success || response.status === 200)) {
            return {
                success: true,
                message: response.data.message || "Logbook berhasil diupdate",
                data: response.data.data || response.data
            };
        }
        throw new Error(response.data?.message || "Gagal mengupdate logbook");
    } catch (error) {
        console.error("Error updating logbook:", error);
        console.error("Error response:", error.response);
        console.error("Error status:", error.response?.status);
        console.error("Error data:", error.response?.data);
        throw new Error(error.response?.data?.message || error.response?.data?.error || error.message || "Gagal mengupdate logbook");
    }
};
const updateStatusPelaksanaan = async (id, status)=>{
    try {
        console.log("Finishing pelaksanaan for layanan:", id);
        console.log("API URL:", `/api/v1/layanan/${id}/finish-pelaksanaan`);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].put(`/api/v1/layanan/${id}/finish-pelaksanaan`);
        console.log("Finish pelaksanaan response:", response.data);
        if (response.data && (response.data.success || response.status === 200 || response.status === 201)) {
            return {
                success: true,
                message: response.data.message || "Status pelaksanaan berhasil diupdate",
                data: response.data.data || response.data
            };
        }
        throw new Error(response.data?.message || "Gagal mengupdate status pelaksanaan");
    } catch (error) {
        console.error("Error finishing pelaksanaan:", error);
        console.error("Error response:", error.response);
        console.error("Error status:", error.response?.status);
        console.error("Error data:", error.response?.data);
        throw new Error(error.response?.data?.message || error.response?.data?.error || error.message || "Gagal mengupdate status pelaksanaan");
    }
};
const getStatusColor = (status)=>{
    const statusLower = status.toLowerCase();
    if (statusLower.includes("disetujui") || statusLower.includes("selesai")) {
        return "bg-green-100 text-green-700 border-green-200";
    }
    if (statusLower.includes("ditolak") || statusLower.includes("batal")) {
        return "bg-red-100 text-red-700 border-red-200";
    }
    if (statusLower.includes("menunggu") || statusLower.includes("pending")) {
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
    if (statusLower.includes("berlangsung") || statusLower.includes("proses")) {
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
    return "bg-gray-100 text-gray-700 border-gray-200";
};
const formatDate = (dateString)=>{
    return new Date(dateString).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
};
const getSlugFromJenisLayanan = (namaJenis)=>{
    const namaLower = namaJenis.toLowerCase();
    if (namaLower.includes("pkl")) return "pkl";
    if (namaLower.includes("magang")) return "magang";
    if (namaLower.includes("pelatihan")) return "pelatihan";
    if (namaLower.includes("kunjungan")) return "kunjungan";
    if (namaLower.includes("narasumber")) return "undangan-narasumber";
    return namaJenis.toLowerCase().replace(/\s+/g, "-");
};
}}),
"[project]/app/utils/mou.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "approveMou": (()=>approveMou),
    "createMou": (()=>createMou),
    "fetchMouById": (()=>fetchMouById),
    "rejectMou": (()=>rejectMou),
    "updateMou": (()=>updateMou)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/api.ts [app-ssr] (ecmascript)");
;
const fetchMouById = async (id)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(`/api/v1/mou/${id}`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || "Gagal mengambil data MOU");
    } catch (error) {
        console.error("Error fetching MOU:", error);
        throw new Error(error.response?.data?.message || error.message || "Gagal mengambil data MOU");
    }
};
const createMou = async (data)=>{
    try {
        const formData = new FormData();
        formData.append("id_layanan", data.id_layanan.toString());
        formData.append("file_mou", data.file_mou);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post("/api/v1/mou", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || "Gagal mengunggah MOU");
    } catch (error) {
        console.error("Error creating MOU:", error);
        throw new Error(error.response?.data?.message || error.message || "Gagal mengunggah MOU");
    }
};
const updateMou = async (id, file_mou)=>{
    try {
        const formData = new FormData();
        formData.append("file_mou", file_mou);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].put(`/api/v1/mou/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || "Gagal memperbarui MOU");
    } catch (error) {
        console.error("Error updating MOU:", error);
        throw new Error(error.response?.data?.message || error.message || "Gagal memperbarui MOU");
    }
};
const approveMou = async (id)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].put(`/api/v1/mou/${id}/accept`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || "Gagal menyetujui MOU");
    } catch (error) {
        console.error("Error approving MOU:", error);
        throw new Error(error.response?.data?.message || error.message || "Gagal menyetujui MOU");
    }
};
const rejectMou = async (id, alasan)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].put(`/api/v1/mou/${id}/reject`, {
            alasan
        });
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || "Gagal menolak MOU");
    } catch (error) {
        console.error("Error rejecting MOU:", error);
        throw new Error(error.response?.data?.message || error.message || "Gagal menolak MOU");
    }
};
}}),
"[project]/app/admin/layanan/monitoring/[id]/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>AdminMonitoringDetailPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-ssr] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-ssr] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-check.js [app-ssr] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clipboard-list.js [app-ssr] (ecmascript) <export default as ClipboardList>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/award.js [app-ssr] (ecmascript) <export default as Award>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-ssr] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-ssr] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-ssr] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$layanan$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/layanan.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$mou$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/mou.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
function AdminMonitoringDetailPage() {
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [layananData, setLayananData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Sertifikat upload states
    const [sertifikatFile, setSertifikatFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [sertifikatLink, setSertifikatLink] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [uploadingSertifikat, setUploadingSertifikat] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [steps, setSteps] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        pengajuan: "active",
        mou: "inactive",
        pelaksanaan: "inactive",
        laporan: "inactive",
        sertifikat: "inactive"
    });
    // Fetch layanan data
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const loadData = async ()=>{
            if (!params?.id) return;
            try {
                setLoading(true);
                const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$layanan$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchLayananById"])(Number(params.id), {
                    include_jenis: true,
                    include_peserta: true,
                    include_mou: true,
                    include_sertifikat: true,
                    include_laporan: true,
                    include_rejection: true
                });
                setLayananData(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching layanan:", err);
                setError(err.message || "Gagal memuat data layanan");
            } finally{
                setLoading(false);
            }
        };
        loadData();
    }, [
        params?.id
    ]);
    // Update laporan step status when laporan is filled
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!layananData) return;
        const laporanData = Array.isArray(layananData?.laporan) ? layananData.laporan[0] : layananData?.laporan;
        const hasLaporan = !!(laporanData?.id_laporan || laporanData?.id);
        if (hasLaporan) {
            setSteps((prev)=>({
                    ...prev,
                    laporan: "done"
                }));
        }
    }, [
        layananData
    ]);
    // DISABLED: Polling can interfere with immediate state updates
    // Uncomment if real-time sync is needed after testing
    // useEffect(() => {
    //   if (!params?.id || loading) return;
    //   const pollInterval = setInterval(async () => {
    //     try {
    //       const data = await fetchLayananById(Number(params.id), {
    //         include_jenis: true,
    //         include_peserta: true,
    //         include_mou: true,
    //         include_sertifikat: true,
    //         include_laporan: true,
    //         include_rejection: true,
    //         include_pengajuan: true,
    //         include_pelaksanaan: true,
    //       });
    //       setLayananData(data);
    //     } catch (err) {
    //       console.error("[Admin] Error polling:", err);
    //     }
    //   }, 30000); // 30 seconds
    //   return () => clearInterval(pollInterval);
    // }, [params?.id, loading]);
    // Helper: build file URL
    const resolveFileUrl = (path)=>{
        if (!path) return null;
        const trimmed = path.trim();
        if (trimmed === "" || trimmed.toLowerCase() === "null" || trimmed.toLowerCase() === "undefined") return null;
        if (/^https?:\/\//i.test(trimmed)) return trimmed;
        const base = (("TURBOPACK compile-time value", "https://be-web-sekolah-kopi-raisa.vercel.app") || "").replace(/\/$/, "");
        const p = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
        return `${base}${p}`;
    };
    const openFile = (url)=>{
        if (!url) return;
        if ("TURBOPACK compile-time falsy", 0) {
            "TURBOPACK unreachable";
        }
    };
    const downloadFile = (url, filename)=>{
        if (!url || typeof document === "undefined") return;
        fetch(url).then((response)=>{
            if (!response.ok) throw new Error("Network response was not ok");
            return response.blob();
        }).then((blob)=>{
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = filename || "download.pdf";
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
        }).catch((error)=>{
            console.error("Download error:", error);
            window.open(url, "_blank");
        });
    };
    const goNext = (current)=>{
        const order = [
            "pengajuan",
            "mou",
            "pelaksanaan",
            "laporan",
            "sertifikat"
        ];
        const idx = order.indexOf(current);
        const next = order[idx + 1];
        setSteps((prev)=>({
                ...prev,
                [current]: "done",
                ...next ? {
                    [next]: "active"
                } : {}
            }));
    };
    // Approve Pengajuan
    const handleApprovePengajuan = async ()=>{
        if (!layananData) return;
        const Swal = (await __turbopack_context__.r("[project]/node_modules/sweetalert2/dist/sweetalert2.esm.all.js [app-ssr] (ecmascript, async loader)")(__turbopack_context__.i)).default;
        const result = await Swal.fire({
            title: "Apakah Anda yakin ingin menyetujui pengajuan ini?",
            html: "pastikan semua data yang diajukan sudah sesuai",
            showCancelButton: true,
            cancelButtonText: "Batal",
            confirmButtonText: "Yakin",
            confirmButtonColor: "#4E342E",
            customClass: {
                popup: "rounded-xl"
            }
        });
        if (result.isConfirmed) {
            try {
                Swal.fire({
                    title: "Memproses...",
                    text: "Mohon tunggu sebentar",
                    allowOutsideClick: false,
                    didOpen: ()=>{
                        Swal.showLoading();
                    }
                });
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$layanan$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["acceptPengajuan"])(layananData.id);
                // Optimistic update - immediately change status in local state
                setLayananData((prev)=>prev ? {
                        ...prev,
                        pengajuan: {
                            ...prev.pengajuan,
                            nama_status_kode: "Disetujui"
                        },
                        pelaksanaan: {
                            ...prev.pelaksanaan,
                            nama_status_kode: "Belum Terlaksana"
                        }
                    } : null);
                // Reload data from server (will be overridden by backend bug, but optimistic update already applied)
                const updated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$layanan$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchLayananById"])(layananData.id, {
                    include_jenis: true,
                    include_peserta: true,
                    include_mou: true,
                    include_sertifikat: true,
                    include_laporan: true,
                    include_rejection: true
                });
                // Only update if backend returns correct status (won't happen until backend fixed)
                // Keep optimistic update if backend still buggy
                if (updated.pengajuan?.nama_status_kode?.toLowerCase().includes("disetujui")) {
                    setLayananData(updated);
                }
                await Swal.fire({
                    icon: "success",
                    title: "Pengajuan Disetujui",
                    html: "Pengajuan berhasil disetujui.",
                    confirmButtonColor: "#4E342E",
                    customClass: {
                        popup: "rounded-xl"
                    }
                });
            } catch (error) {
                await Swal.fire({
                    icon: "error",
                    title: "Gagal Menyetujui",
                    text: error.message || "Terjadi kesalahan",
                    confirmButtonColor: "#4E342E",
                    customClass: {
                        popup: "rounded-xl"
                    }
                });
            }
        }
    };
    // Reject Pengajuan
    const handleRejectPengajuan = async ()=>{
        if (!layananData) return;
        const Swal = (await __turbopack_context__.r("[project]/node_modules/sweetalert2/dist/sweetalert2.esm.all.js [app-ssr] (ecmascript, async loader)")(__turbopack_context__.i)).default;
        const { value: text, isConfirmed } = await Swal.fire({
            title: "Tolak Pengajuan",
            html: `berikan alasan penolakan untuk membantu peserta memahami dan memperbaiki pengajuan mereka`,
            input: "textarea",
            inputLabel: "alasan Penolakan",
            inputPlaceholder: "Contoh : Dokumen yang di Upload Tidak lengkap. Pada bagian Proposal tidak disertakan ttd pihak Instansi",
            inputAttributes: {
                "aria-label": "Alasan"
            },
            showCancelButton: true,
            cancelButtonText: "Batal",
            confirmButtonText: "Tolak",
            confirmButtonColor: "#4E342E",
            focusConfirm: false,
            customClass: {
                popup: "rounded-xl"
            }
        });
        if (isConfirmed) {
            if (!text || text.trim() === "") {
                await Swal.fire({
                    icon: "warning",
                    title: "Alasan Wajib Diisi",
                    text: "Mohon berikan alasan penolakan",
                    confirmButtonColor: "#4E342E",
                    customClass: {
                        popup: "rounded-xl"
                    }
                });
                return;
            }
            try {
                Swal.fire({
                    title: "Memproses...",
                    text: "Mohon tunggu sebentar",
                    allowOutsideClick: false,
                    didOpen: ()=>{
                        Swal.showLoading();
                    }
                });
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$layanan$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rejectPengajuan"])(layananData.id, text);
                // Optimistic update - immediately change status in local state
                setLayananData((prev)=>prev ? {
                        ...prev,
                        pengajuan: {
                            ...prev.pengajuan,
                            nama_status_kode: "Ditolak"
                        },
                        pelaksanaan: {
                            ...prev.pelaksanaan,
                            nama_status_kode: "Ditolak"
                        },
                        layananRejection: Array.isArray(prev.layananRejection) ? [
                            {
                                id: Date.now(),
                                id_layanan: prev.id,
                                alasan: text
                            }
                        ] : {
                            id: Date.now(),
                            id_layanan: prev.id,
                            alasan: text
                        }
                    } : null);
                // Reload data from server
                const updated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$layanan$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchLayananById"])(layananData.id, {
                    include_jenis: true,
                    include_peserta: true,
                    include_mou: true,
                    include_sertifikat: true,
                    include_laporan: true,
                    include_rejection: true
                });
                // Merge: keep optimistic status if backend buggy, but use backend rejection data if available
                setLayananData((prev)=>({
                        ...updated,
                        pengajuan: updated.pengajuan?.nama_status_kode?.toLowerCase().includes("ditolak") ? updated.pengajuan : prev?.pengajuan || updated.pengajuan,
                        pelaksanaan: updated.pelaksanaan?.nama_status_kode?.toLowerCase().includes("ditolak") ? updated.pelaksanaan : prev?.pelaksanaan || updated.pelaksanaan,
                        layananRejection: updated.layananRejection || prev?.layananRejection
                    }));
                await Swal.fire({
                    icon: "success",
                    title: "Pengajuan Berhasil Ditolak",
                    html: `<p class="text-sm mb-2">Alasan Penolakan:</p><p class="text-sm font-semibold">${text}</p>`,
                    confirmButtonColor: "#4E342E",
                    customClass: {
                        popup: "rounded-xl"
                    }
                });
            } catch (error) {
                await Swal.fire({
                    icon: "error",
                    title: "Gagal Menolak",
                    text: error.message || "Terjadi kesalahan",
                    confirmButtonColor: "#4E342E",
                    customClass: {
                        popup: "rounded-xl"
                    }
                });
            }
        }
    };
    // Approve MOU
    const handleApproveMou = async ()=>{
        if (!layananData?.mou?.id) return;
        const Swal = (await __turbopack_context__.r("[project]/node_modules/sweetalert2/dist/sweetalert2.esm.all.js [app-ssr] (ecmascript, async loader)")(__turbopack_context__.i)).default;
        const result = await Swal.fire({
            title: "Apakah Anda yakin ingin menyetujui MOU ini?",
            html: "pastikan dokumen MOU yang diajukan sudah sesuai",
            showCancelButton: true,
            cancelButtonText: "Batal",
            confirmButtonText: "Yakin",
            confirmButtonColor: "#4E342E",
            customClass: {
                popup: "rounded-xl"
            }
        });
        if (result.isConfirmed) {
            try {
                Swal.fire({
                    title: "Memproses...",
                    text: "Mohon tunggu sebentar",
                    allowOutsideClick: false,
                    didOpen: ()=>{
                        Swal.showLoading();
                    }
                });
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$mou$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["approveMou"])(layananData.mou.id);
                // Reload data
                const updated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$layanan$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchLayananById"])(layananData.id, {
                    include_jenis: true,
                    include_peserta: true,
                    include_mou: true,
                    include_sertifikat: true,
                    include_laporan: true,
                    include_rejection: true
                });
                setLayananData(updated);
                goNext("mou");
                await Swal.fire({
                    icon: "success",
                    title: "MOU Disetujui",
                    html: "MOU berhasil disetujui",
                    confirmButtonColor: "#4E342E",
                    customClass: {
                        popup: "rounded-xl"
                    }
                });
            } catch (error) {
                await Swal.fire({
                    icon: "error",
                    title: "Gagal Menyetujui MOU",
                    text: error.message || "Terjadi kesalahan",
                    confirmButtonColor: "#4E342E",
                    customClass: {
                        popup: "rounded-xl"
                    }
                });
            }
        }
    };
    // Reject MOU
    const handleRejectMou = async ()=>{
        if (!layananData?.mou?.id) return;
        const Swal = (await __turbopack_context__.r("[project]/node_modules/sweetalert2/dist/sweetalert2.esm.all.js [app-ssr] (ecmascript, async loader)")(__turbopack_context__.i)).default;
        const { value: text, isConfirmed } = await Swal.fire({
            title: "Tolak MOU",
            html: `berikan alasan penolakan untuk membantu peserta memahami dan memperbaiki MOU mereka`,
            input: "textarea",
            inputLabel: "alasan Penolakan",
            inputPlaceholder: "Contoh : MOU belum ditandatangani oleh pihak yang berwenang",
            inputAttributes: {
                "aria-label": "Alasan"
            },
            showCancelButton: true,
            cancelButtonText: "Batal",
            confirmButtonText: "Tolak",
            confirmButtonColor: "#4E342E",
            focusConfirm: false,
            customClass: {
                popup: "rounded-xl"
            }
        });
        if (isConfirmed) {
            if (!text || text.trim() === "") {
                await Swal.fire({
                    icon: "warning",
                    title: "Alasan Wajib Diisi",
                    text: "Mohon berikan alasan penolakan",
                    confirmButtonColor: "#4E342E",
                    customClass: {
                        popup: "rounded-xl"
                    }
                });
                return;
            }
            try {
                Swal.fire({
                    title: "Memproses...",
                    text: "Mohon tunggu sebentar",
                    allowOutsideClick: false,
                    didOpen: ()=>{
                        Swal.showLoading();
                    }
                });
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$mou$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rejectMou"])(layananData.mou.id, text);
                // Reload data
                const updated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$layanan$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchLayananById"])(layananData.id, {
                    include_jenis: true,
                    include_peserta: true,
                    include_mou: true,
                    include_sertifikat: true,
                    include_laporan: true,
                    include_rejection: true
                });
                setLayananData(updated);
                await Swal.fire({
                    icon: "success",
                    title: "MOU Berhasil Ditolak",
                    html: text && text.length > 0 ? text : "MOU ditolak.",
                    confirmButtonColor: "#4E342E",
                    customClass: {
                        popup: "rounded-xl"
                    }
                });
            } catch (error) {
                await Swal.fire({
                    icon: "error",
                    title: "Gagal Menolak MOU",
                    text: error.message || "Terjadi kesalahan",
                    confirmButtonColor: "#4E342E",
                    customClass: {
                        popup: "rounded-xl"
                    }
                });
            }
        }
    };
    const sendCertificateAlert = async ()=>{
        const Swal = (await __turbopack_context__.r("[project]/node_modules/sweetalert2/dist/sweetalert2.esm.all.js [app-ssr] (ecmascript, async loader)")(__turbopack_context__.i)).default;
        const confirm = await Swal.fire({
            title: "Kirim Sertifikat?",
            html: "Sertifikat akan dikirim ke peserta. Pastikan file sudah benar.",
            showCancelButton: true,
            cancelButtonText: "Batal",
            confirmButtonText: "Kirim",
            confirmButtonColor: "#4E342E",
            customClass: {
                popup: "rounded-xl"
            }
        });
        if (confirm.isConfirmed) {
            await Swal.fire({
                icon: "success",
                title: "Sertifikat Dikirim",
                html: "Sertifikat berhasil dikirim ke peserta.",
                confirmButtonColor: "#4E342E",
                customClass: {
                    popup: "rounded-xl"
                }
            });
            setSteps((prev)=>({
                    ...prev,
                    sertifikat: "done"
                }));
        }
    };
    const StepItem = ({ label, icon, status })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `flex items-center gap-3 px-4 py-3 rounded-lg border ${status === "active" ? "bg-neutral-100 border-neutral-200" : status === "done" ? "bg-white border-emerald-200" : "bg-white border-neutral-200 opacity-60"}`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `shrink-0 h-8 w-8 grid place-items-center rounded-md ${status === "done" ? "bg-green-100 text-green-700" : "bg-neutral-200 text-neutral-700"}`,
                    children: icon
                }, void 0, false, {
                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                    lineNumber: 546,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-sm font-medium",
                    children: label
                }, void 0, false, {
                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                    lineNumber: 555,
                    columnNumber: 7
                }, this),
                status === "done" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "ml-auto inline-flex items-center gap-1 text-xs text-emerald-700",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                            size: 14
                        }, void 0, false, {
                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                            lineNumber: 558,
                            columnNumber: 11
                        }, this),
                        " Selesai"
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                    lineNumber: 557,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
            lineNumber: 537,
            columnNumber: 5
        }, this);
    // Loading state
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-tertiary",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full px-4 md:px-6 py-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "animate-pulse space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-8 bg-gray-200 rounded w-1/4"
                        }, void 0, false, {
                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                            lineNumber: 570,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-64 bg-gray-200 rounded"
                        }, void 0, false, {
                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                            lineNumber: 571,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-96 bg-gray-200 rounded"
                        }, void 0, false, {
                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                            lineNumber: 572,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                    lineNumber: 569,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                lineNumber: 568,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
            lineNumber: 567,
            columnNumber: 7
        }, this);
    }
    // Error state
    if (error || !layananData) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-tertiary",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full px-4 md:px-6 py-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.back(),
                        className: "mb-4 bg-amber-50 rounded-full border border-amber-500 px-3 py-1 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                size: 18
                            }, void 0, false, {
                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                lineNumber: 588,
                                columnNumber: 13
                            }, this),
                            " Kembali"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                        lineNumber: 584,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-xl border border-red-200 bg-red-50 p-6 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-semibold text-red-800 mb-2",
                                children: "Gagal Memuat Data"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                lineNumber: 591,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-red-600 mb-4",
                                children: error || "Data layanan tidak ditemukan"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                lineNumber: 594,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>router.back(),
                                className: "inline-flex items-center rounded-lg bg-red-600 text-white px-4 py-2 hover:bg-red-700",
                                children: "Kembali"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                lineNumber: 597,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                        lineNumber: 590,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                lineNumber: 583,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
            lineNumber: 582,
            columnNumber: 7
        }, this);
    }
    // Get peserta info
    const pesertaInfo = layananData.peserta?.[0];
    const jenisNama = layananData.jenisLayanan?.nama_jenis_layanan || layananData.jenis_layanan?.nama_jenis_layanan || "";
    // Check if MOU workflow applies (PKL, Magang, Pelatihan)
    const hasMouWorkflow = [
        "Magang",
        "Praktek Kerja Lapangan (PKL)",
        "Pelatihan"
    ].some((j)=>jenisNama.includes(j));
    // Check if it's simple workflow (Kunjungan, Undangan Narasumber - only Pengajuan + Pelaksanaan)
    const isSimpleWorkflow = [
        "Kunjungan",
        "Undangan Narasumber"
    ].some((j)=>jenisNama.includes(j));
    // Determine if pengajuan is in pending state (can approve/reject)
    // Note: These are recalculated on every render to reflect optimistic updates
    const statusPengajuan = layananData?.pengajuan?.nama_status_kode?.toLowerCase() || "";
    const statusPelaksanaan = layananData?.pelaksanaan?.nama_status_kode?.toLowerCase() || "";
    const isPengajuanPending = statusPengajuan.includes("menunggu") && !statusPengajuan.includes("disetujui") && !statusPengajuan.includes("ditolak");
    const isPengajuanApproved = statusPengajuan.includes("disetujui");
    const isPengajuanRejected = statusPengajuan.includes("ditolak");
    // Determine if MOU is in pending state (can approve/reject)
    const isMouPending = layananData?.mou?.statusKode?.nama_status_kode?.toLowerCase().includes("menunggu") && !layananData?.mou?.statusKode?.nama_status_kode?.toLowerCase().includes("disetujui") && !layananData?.mou?.statusKode?.nama_status_kode?.toLowerCase().includes("ditolak");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-tertiary",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full px-4 md:px-6 py-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>router.back(),
                    className: "mb-4 bg-amber-50 rounded-full border border-amber-500 px-3 py-1 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                            size: 18
                        }, void 0, false, {
                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                            lineNumber: 661,
                            columnNumber: 11
                        }, this),
                        " Kembali"
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                    lineNumber: 657,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-10",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-2xl font-bold text-center",
                            children: "Detail Kegiatan"
                        }, void 0, false, {
                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                            lineNumber: 664,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-gray-500 text-center mt-1",
                            children: "Ringkasan kegiatan yang diikuti peserta di Sekolah Kopi Raisa"
                        }, void 0, false, {
                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                            lineNumber: 665,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                    lineNumber: 663,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-3 gap-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "md:col-span-1 bg-white rounded-xl border border-gray-100 p-5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mx-auto h-12 w-12 grid place-items-center rounded-xl bg-neutral-100 text-neutral-700",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {}, void 0, false, {
                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                        lineNumber: 674,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                    lineNumber: 673,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-center font-semibold mt-3",
                                    children: "Progres Kegiatan"
                                }, void 0, false, {
                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                    lineNumber: 676,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-center text-xs text-gray-500 mb-4",
                                    children: "Pantau Status Pelaksanaan Kegiatan Anda"
                                }, void 0, false, {
                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                    lineNumber: 677,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StepItem, {
                                            label: "Pengajuan",
                                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                size: 16
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                lineNumber: 683,
                                                columnNumber: 23
                                            }, void 0),
                                            status: steps.pengajuan
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 681,
                                            columnNumber: 15
                                        }, this),
                                        isSimpleWorkflow ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StepItem, {
                                            label: "Laporan Akhir",
                                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                size: 16
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                lineNumber: 691,
                                                columnNumber: 25
                                            }, void 0),
                                            status: steps.laporan
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 689,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StepItem, {
                                                    label: "MOU",
                                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                                        size: 16
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 699,
                                                        columnNumber: 27
                                                    }, void 0),
                                                    status: steps.mou
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 697,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StepItem, {
                                                    label: "Pelaksanaan",
                                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__["ClipboardList"], {
                                                        size: 16
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 704,
                                                        columnNumber: 27
                                                    }, void 0),
                                                    status: steps.pelaksanaan
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 702,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StepItem, {
                                                    label: "Laporan Akhir",
                                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                        size: 16
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 709,
                                                        columnNumber: 27
                                                    }, void 0),
                                                    status: steps.laporan
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 707,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StepItem, {
                                                    label: "Sertifikat Kegiatan",
                                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__["Award"], {
                                                        size: 16
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 714,
                                                        columnNumber: 27
                                                    }, void 0),
                                                    status: steps.sertifikat
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 712,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                    lineNumber: 680,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                            lineNumber: 672,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "md:col-span-2 bg-white rounded-xl border border-gray-100 p-5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-lg font-semibold",
                                                    children: "Ringkasan Pengajuan & Dokumen"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 726,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-gray-600",
                                                    children: "Detail Informasi dan Dokumen yang telah anda Submit"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 729,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 725,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col items-end gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs text-gray-500",
                                                            children: "Status Pengajuan:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 736,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `px-3 py-1 text-xs font-medium rounded-full ${layananData.pengajuan?.nama_status_kode?.toLowerCase().includes("disetujui") ? "bg-green-100 text-green-700" : layananData.pengajuan?.nama_status_kode?.toLowerCase().includes("ditolak") ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`,
                                                            children: layananData.pengajuan?.nama_status_kode || "-"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 739,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 735,
                                                    columnNumber: 17
                                                }, this),
                                                !isSimpleWorkflow && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs text-gray-500",
                                                            children: "Status Pelaksanaan:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 758,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `px-3 py-1 text-xs font-medium rounded-full ${layananData.pelaksanaan?.nama_status_kode?.toLowerCase().includes("selesai") ? "bg-green-100 text-green-700" : layananData.pelaksanaan?.nama_status_kode?.toLowerCase().includes("berjalan") ? "bg-blue-100 text-blue-700" : layananData.pelaksanaan?.nama_status_kode?.toLowerCase().includes("ditolak") ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`,
                                                            children: layananData.pelaksanaan?.nama_status_kode || "-"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 761,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 757,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 734,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                    lineNumber: 724,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-neutral-200 rounded-lg p-4 mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-500",
                                                    children: "Jenis Kegiatan"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 787,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm",
                                                    children: jenisNama || "-"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 788,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 786,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-500",
                                                    children: "Tanggal Mulai"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 791,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm",
                                                    children: layananData.tanggal_mulai ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$layanan$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(layananData.tanggal_mulai) : "-"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 792,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 790,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-500",
                                                    children: "Nama Peserta"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 799,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm",
                                                    children: pesertaInfo?.nama_peserta || pesertaInfo?.nama || layananData.pemohon?.name || "-"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 800,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 798,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-500",
                                                    children: "Tanggal Selesai"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 808,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm",
                                                    children: layananData.tanggal_selesai ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$layanan$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(layananData.tanggal_selesai) : "-"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 809,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 807,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-500",
                                                    children: "Instansi"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 816,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm",
                                                    children: layananData.instansi_asal || "-"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 817,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 815,
                                            columnNumber: 15
                                        }, this),
                                        jenisNama.includes("Undangan Narasumber") ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-gray-500",
                                                            children: "Nama Kegiatan"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 823,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm",
                                                            children: layananData.nama_kegiatan || "-"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 824,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 822,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-gray-500",
                                                            children: "Tempat Kegiatan"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 829,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm",
                                                            children: layananData.tempat_kegiatan || "-"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 830,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 828,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true) : !jenisNama.includes("Kunjungan") ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-500",
                                                    children: "Kegiatan yang dipilih"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 837,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm",
                                                    children: layananData.kegiatan?.map((k)=>k.nama_kegiatan).join(", ") || "-"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 838,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 836,
                                            columnNumber: 17
                                        }, this) : null
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                    lineNumber: 785,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm font-semibold mb-3",
                                            children: "Dokumen yang diupload"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 849,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-3",
                                            children: [
                                                isSimpleWorkflow && jenisNama.includes("Undangan Narasumber") && layananData.file_proposal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-white rounded-xl border border-gray-100 p-3 flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "h-8 w-8 grid place-items-center rounded-md bg-neutral-200 text-neutral-700",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                                        size: 16
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                        lineNumber: 860,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 859,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm font-medium",
                                                                            children: "Proposal"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 863,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs text-gray-500",
                                                                            children: "Proposal.pdf"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 864,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 862,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 858,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>openFile(resolveFileUrl(layananData.file_proposal)),
                                                                    className: "px-3 py-1.5 text-xs rounded-md border border-gray-200 hover:bg-gray-50 flex items-center gap-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                            size: 14
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 874,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        " Lihat"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 868,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>downloadFile(resolveFileUrl(layananData.file_proposal), "Proposal.pdf"),
                                                                    className: "px-3 py-1.5 text-xs rounded-md bg-gray-100 hover:bg-gray-200 flex items-center gap-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                                            size: 14
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 885,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        " Download"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 876,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 867,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 857,
                                                    columnNumber: 21
                                                }, this),
                                                !jenisNama.includes("Undangan Narasumber") && (layananData.file_proposal || layananData.file_surat_permohonan) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-white rounded-xl border border-gray-100 p-3 flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "h-8 w-8 grid place-items-center rounded-md bg-neutral-200 text-neutral-700",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                                        size: 16
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                        lineNumber: 898,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 897,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm font-medium",
                                                                            children: "Proposal / Surat Permohonan"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 901,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs text-gray-500",
                                                                            children: "ProposalSuratPermohonan.pdf"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 904,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 900,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 896,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>openFile(resolveFileUrl(layananData.file_proposal || layananData.file_surat_permohonan)),
                                                                    className: "px-3 py-1.5 text-xs rounded-md border border-gray-200 hover:bg-gray-50 flex items-center gap-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                            size: 14
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 921,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        " Lihat"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 910,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>downloadFile(resolveFileUrl(layananData.file_proposal || layananData.file_surat_permohonan), "ProposalSuratPermohonan.pdf"),
                                                                    className: "px-3 py-1.5 text-xs rounded-md bg-gray-100 hover:bg-gray-200 flex items-center gap-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                                            size: 14
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 935,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        " Download"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 923,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 909,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 895,
                                                    columnNumber: 21
                                                }, this),
                                                layananData.file_surat_pengantar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-white rounded-xl border border-gray-100 p-3 flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "h-8 w-8 grid place-items-center rounded-md bg-neutral-200 text-neutral-700",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                                        size: 16
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                        lineNumber: 946,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 945,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm font-medium",
                                                                            children: "Surat Pengantar"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 949,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs text-gray-500",
                                                                            children: "SuratPengantar.pdf"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 950,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 948,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 944,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>openFile(resolveFileUrl(layananData.file_surat_pengantar)),
                                                                    className: "px-3 py-1.5 text-xs rounded-md border border-gray-200 hover:bg-gray-50 flex items-center gap-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                            size: 14
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 964,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        " Lihat"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 956,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>downloadFile(resolveFileUrl(layananData.file_surat_pengantar), "SuratPengantar.pdf"),
                                                                    className: "px-3 py-1.5 text-xs rounded-md bg-gray-100 hover:bg-gray-200 flex items-center gap-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                                            size: 14
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 975,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        " Download"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 966,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 955,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 943,
                                                    columnNumber: 19
                                                }, this),
                                                layananData.file_surat_undangan && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-white rounded-xl border border-gray-100 p-3 flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "h-8 w-8 grid place-items-center rounded-md bg-neutral-200 text-neutral-700",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                                        size: 16
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                        lineNumber: 986,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 985,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm font-medium",
                                                                            children: "Surat Undangan"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 989,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs text-gray-500",
                                                                            children: "SuratUndangan.pdf"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 990,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 988,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 984,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>openFile(resolveFileUrl(layananData.file_surat_undangan)),
                                                                    className: "px-3 py-1.5 text-xs rounded-md border border-gray-200 hover:bg-gray-50 flex items-center gap-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                            size: 14
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 1004,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        " Lihat"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 996,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>downloadFile(resolveFileUrl(layananData.file_surat_undangan), "SuratUndangan.pdf"),
                                                                    className: "px-3 py-1.5 text-xs rounded-md bg-gray-100 hover:bg-gray-200 flex items-center gap-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                                            size: 14
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 1015,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        " Download"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 1006,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 995,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 983,
                                                    columnNumber: 19
                                                }, this),
                                                hasMouWorkflow && layananData.mou?.file_mou && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-white rounded-xl border border-gray-100 p-3 flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "h-8 w-8 grid place-items-center rounded-md bg-neutral-200 text-neutral-700",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                                                        size: 16
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                        lineNumber: 1026,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 1025,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm font-medium",
                                                                            children: "MOU"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 1029,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs text-gray-500",
                                                                            children: "MOU.pdf"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 1030,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        layananData.mou.statusKode?.nama_status_kode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: `text-xs ${layananData.mou.statusKode.nama_status_kode.toLowerCase().includes("disetujui") ? "text-green-600" : layananData.mou.statusKode.nama_status_kode.toLowerCase().includes("ditolak") ? "text-red-600" : "text-yellow-600"}`,
                                                                            children: layananData.mou.statusKode.nama_status_kode
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 1032,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 1028,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 1024,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>openFile(resolveFileUrl(layananData.mou?.file_mou)),
                                                                    className: "px-3 py-1.5 text-xs rounded-md border border-gray-200 hover:bg-gray-50 flex items-center gap-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                            size: 14
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 1057,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        " Lihat"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 1051,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>downloadFile(resolveFileUrl(layananData.mou?.file_mou), "MOU.pdf"),
                                                                    className: "px-3 py-1.5 text-xs rounded-md bg-gray-100 hover:bg-gray-200 flex items-center gap-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                                            size: 14
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 1068,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        " Download"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 1059,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 1050,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1023,
                                                    columnNumber: 19
                                                }, this),
                                                (()=>{
                                                    const rejection = layananData.layananRejection;
                                                    const alasan = layananData.pengajuanRejection?.alasan || (Array.isArray(rejection) ? rejection[0]?.alasan : rejection?.alasan) || layananData.rejection?.alasan || layananData.pengajuan?.alasan_penolakan || layananData.alasan_penolakan;
                                                    return alasan ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-red-50 border border-red-200 rounded-lg p-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm font-semibold text-red-700 mb-1",
                                                                children: "Alasan Penolakan Pengajuan"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                lineNumber: 1088,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-red-600 whitespace-pre-wrap",
                                                                children: alasan
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                lineNumber: 1091,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1087,
                                                        columnNumber: 21
                                                    }, this) : null;
                                                })(),
                                                hasMouWorkflow && layananData.mou?.mouRejection?.alasan && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-red-50 border border-red-200 rounded-lg p-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm font-semibold text-red-700 mb-1",
                                                            children: "Alasan Penolakan MOU"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 1101,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-red-600 whitespace-pre-wrap",
                                                            children: layananData.mou.mouRejection.alasan
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 1104,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1100,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 852,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                    lineNumber: 848,
                                    columnNumber: 13
                                }, this),
                                isPengajuanPending && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-4 justify-center flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100",
                                            onClick: handleRejectPengajuan,
                                            children: "✕ Tolak Pengajuan"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 1116,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-amber-900 text-white hover:bg-amber-950",
                                            onClick: handleApprovePengajuan,
                                            children: "✓ Setujui Pengajuan"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 1123,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                    lineNumber: 1114,
                                    columnNumber: 15
                                }, this),
                                hasMouWorkflow && isMouPending && layananData.mou?.file_mou && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        layananData.mou?.mouRejection && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-4 mb-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full bg-orange-100 text-orange-700 border border-orange-200",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            className: "w-4 h-4",
                                                            fill: "none",
                                                            stroke: "currentColor",
                                                            viewBox: "0 0 24 24",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round",
                                                                strokeWidth: 2,
                                                                d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                lineNumber: 1145,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 1139,
                                                            columnNumber: 23
                                                        }, this),
                                                        "MOU Upload Ulang (Revisi)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1138,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-500 mt-1",
                                                    children: "User telah mengupload ulang MOU setelah sebelumnya ditolak"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1154,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 1137,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-4 justify-center flex items-center gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100",
                                                    onClick: handleRejectMou,
                                                    children: "✕ Tolak MOU"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1162,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-amber-900 text-white hover:bg-amber-950",
                                                    onClick: handleApproveMou,
                                                    children: "✓ Setujui MOU"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1169,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 1160,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                            lineNumber: 723,
                            columnNumber: 11
                        }, this),
                        hasMouWorkflow && layananData.link_logbook && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "md:col-span-3 bg-white rounded-xl border border-gray-100 p-5 mt-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-12 w-12 grid place-items-center rounded-xl bg-blue-100 text-blue-700",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__["ClipboardList"], {
                                                        size: 24
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1186,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1185,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: "text-lg font-semibold",
                                                            children: "Logbook Kegiatan"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 1189,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-600",
                                                            children: "Link logbook yang telah disubmit oleh peserta"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 1190,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1188,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 1184,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 border border-blue-200",
                                            children: "✓ Tersedia"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 1195,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                    lineNumber: 1183,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-gray-50 rounded-lg p-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-500 mb-2",
                                            children: "Link Logbook:"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 1201,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: layananData.link_logbook,
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            className: "text-sm text-blue-600 hover:text-blue-800 hover:underline break-all",
                                            children: layananData.link_logbook
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 1202,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-3",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: layananData.link_logbook,
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                className: "inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                        size: 16
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1217,
                                                        columnNumber: 21
                                                    }, this),
                                                    " Buka Logbook"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                lineNumber: 1211,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 1210,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                    lineNumber: 1200,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                            lineNumber: 1182,
                            columnNumber: 13
                        }, this),
                        (()=>{
                            const laporanData = Array.isArray(layananData?.laporan) ? layananData.laporan[0] : layananData?.laporan;
                            const hasLaporan = !!(laporanData?.id_laporan || laporanData?.id);
                            if (!hasLaporan) return null;
                            const fotoUrl = resolveFileUrl(laporanData?.foto_kegiatan);
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "md:col-span-3 bg-white rounded-xl border border-gray-100 p-5 mt-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "h-12 w-12 grid place-items-center rounded-xl bg-green-100 text-green-700",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                            size: 24
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 1240,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1239,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "text-lg font-semibold",
                                                                children: "Laporan Akhir Kegiatan"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                lineNumber: 1243,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-gray-600",
                                                                children: "Laporan yang telah disubmit oleh peserta"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                lineNumber: 1246,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1242,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                lineNumber: 1238,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 border border-green-200",
                                                children: "✓ Telah Terisi"
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                lineNumber: 1251,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                        lineNumber: 1237,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700 mb-1",
                                                        children: "Nama P4S / Balai Benih Kopi"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1259,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700",
                                                        children: laporanData?.nama_p4s || "-"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1262,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                lineNumber: 1258,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700 mb-1",
                                                        children: "Asal Kab/Kota"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1269,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700",
                                                        children: laporanData?.asal_kab_kota || "-"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1272,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                lineNumber: 1268,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700 mb-1",
                                                        children: "Jenis Kegiatan"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1279,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700",
                                                        children: jenisNama || "-"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1282,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                lineNumber: 1278,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700 mb-1",
                                                        children: "Asal Peserta"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1289,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700",
                                                        children: layananData?.instansi_asal || "-"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1292,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                lineNumber: 1288,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700 mb-1",
                                                        children: "Jumlah Peserta"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1299,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700",
                                                        children: [
                                                            layananData?.jumlah_peserta || "-",
                                                            " orang"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1302,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                lineNumber: 1298,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700 mb-1",
                                                        children: "Tanggal Pelaksanaan"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1309,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700",
                                                        children: layananData?.tanggal_mulai ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$layanan$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(layananData.tanggal_mulai) : "-"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1312,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                lineNumber: 1308,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700 mb-1",
                                                        children: "Lama Pelaksanaan"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1321,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700",
                                                        children: "1 hari"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1324,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                lineNumber: 1320,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700 mb-2",
                                                        children: "Foto Kegiatan"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1331,
                                                        columnNumber: 21
                                                    }, this),
                                                    fotoUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-green-50 border border-green-200 rounded-lg p-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "h-10 w-10 grid place-items-center rounded-lg bg-green-100 text-green-700",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                                size: 20
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                                lineNumber: 1339,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 1338,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-sm font-medium text-green-800",
                                                                                    children: "Foto Kegiatan Telah Diupload"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                                    lineNumber: 1342,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-xs text-green-600",
                                                                                    children: "FotoKegiatan.jpg"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                                    lineNumber: 1345,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 1341,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 1337,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>openFile(fotoUrl),
                                                                            className: "px-3 py-1.5 text-xs rounded-md border border-green-300 bg-white hover:bg-green-50 text-green-700 flex items-center gap-1",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                                    size: 14
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                                    lineNumber: 1355,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                " Lihat"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 1351,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>downloadFile(fotoUrl, "FotoKegiatan.jpg"),
                                                                            className: "px-3 py-1.5 text-xs rounded-md bg-green-600 hover:bg-green-700 text-white flex items-center gap-1",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                                                    size: 14
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                                    lineNumber: 1363,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                " Download"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 1357,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 1350,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 1336,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1335,
                                                        columnNumber: 23
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm text-gray-500 italic",
                                                        children: "Tidak ada foto yang diupload"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1369,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                lineNumber: 1330,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                        lineNumber: 1256,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                lineNumber: 1236,
                                columnNumber: 15
                            }, this);
                        })()
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                    lineNumber: 670,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-center text-xs text-gray-400 mt-8",
                    children: [
                        "ID Pengajuan: ",
                        String(params?.id)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                    lineNumber: 1380,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
            lineNumber: 656,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
        lineNumber: 655,
        columnNumber: 5
    }, this);
}
}}),

};

//# sourceMappingURL=app_833c2d36._.js.map