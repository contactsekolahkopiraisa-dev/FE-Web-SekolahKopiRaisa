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
"[project]/app/utils/sertifikat.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "createSertifikat": (()=>createSertifikat),
    "fetchSertifikatById": (()=>fetchSertifikatById)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/api.ts [app-ssr] (ecmascript)");
;
const fetchSertifikatById = async (idLayanan)=>{
    try {
        console.log("Fetching sertifikat detail from:", `/api/v1/sertifikat/${idLayanan}`);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(`/api/v1/sertifikat/${idLayanan}`);
        console.log("Sertifikat detail response:", response.data);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || "Gagal mengambil detail sertifikat");
    } catch (error) {
        console.error("Error fetching sertifikat detail:", error);
        throw new Error(error.response?.data?.message || error.message || "Gagal mengambil detail sertifikat");
    }
};
const createSertifikat = async (payload)=>{
    try {
        console.log("Creating sertifikat for layanan:", payload.id_layanan);
        console.log("File to upload:", payload.file_sertifikat?.name, payload.file_sertifikat?.type);
        const formData = new FormData();
        formData.append("id_layanan", payload.id_layanan.toString());
        if (payload.link_sertifikat) {
            formData.append("link_sertifikat", payload.link_sertifikat);
        }
        formData.append("file_sertifikat", payload.file_sertifikat);
        console.log("FormData contents:");
        for (let pair of formData.entries()){
            console.log(pair[0], pair[1]);
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post("/api/v1/sertifikat", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        console.log("Create sertifikat response:", response.data);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || "Gagal mengupload sertifikat");
    } catch (error) {
        console.error("Error creating sertifikat:", error);
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);
        throw new Error(error.response?.data?.message || error.message || "Gagal mengupload sertifikat");
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/upload.js [app-ssr] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$layanan$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/layanan.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$mou$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/mou.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$sertifikat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/sertifikat.ts [app-ssr] (ecmascript)");
"use client";
;
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
    // Stable state untuk display status (tidak akan berubah setelah disetujui/ditolak)
    const [displayPengajuanStatus, setDisplayPengajuanStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [displayPelaksanaanStatus, setDisplayPelaksanaanStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [isStatusInitialized, setIsStatusInitialized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
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
                // Set initial display status ONLY if not already set (first load)
                if (!isStatusInitialized) {
                    let pengajuanStatus = data?.pengajuan?.nama_status_kode || "";
                    const pelaksanaanStatus = data?.pelaksanaan?.nama_status_kode || "";
                    // NORMALISASI STATUS PENGAJUAN: Jika "Berlangsung" tapi ada progress (MOU/Pelaksanaan),
                    // maka PASTI pengajuan sudah pernah disetujui - override jadi "Disetujui"
                    if (pengajuanStatus.toLowerCase().includes("berlangsung")) {
                        if (data?.mou?.id || data?.pelaksanaan?.id || pelaksanaanStatus) {
                            pengajuanStatus = "Disetujui";
                        }
                    }
                    setDisplayPengajuanStatus(pengajuanStatus);
                    setDisplayPelaksanaanStatus(pelaksanaanStatus);
                    setIsStatusInitialized(true);
                }
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
    // Update all steps status based on actual data
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!layananData) return;
        // GUNAKAN STABLE STATUS dari state, bukan langsung dari backend
        const statusPengajuan = displayPengajuanStatus.toLowerCase() || layananData?.pengajuan?.nama_status_kode?.toLowerCase() || "";
        const statusPelaksanaan = displayPelaksanaanStatus.toLowerCase() || layananData?.pelaksanaan?.nama_status_kode?.toLowerCase() || "";
        const statusMou = layananData?.mou?.statusKode?.nama_status_kode?.toLowerCase() || "";
        const laporanData = Array.isArray(layananData?.laporan) ? layananData.laporan[0] : layananData?.laporan;
        const hasLaporan = !!(laporanData?.id_laporan || laporanData?.id);
        const sertifikatData = Array.isArray(layananData?.sertifikat) ? layananData.sertifikat[0] : layananData?.sertifikat;
        const hasSertifikat = !!(sertifikatData?.id || sertifikatData?.file_sertifikat);
        const jenisNama = layananData.jenisLayanan?.nama_jenis_layanan || layananData.jenis_layanan?.nama_jenis_layanan || "";
        const hasMouWorkflow = [
            "Magang",
            "Praktek Kerja Lapangan (PKL)",
            "Pelatihan"
        ].some((j)=>jenisNama.includes(j));
        const isSimpleWorkflow = [
            "Kunjungan",
            "Undangan Narasumber"
        ].some((j)=>jenisNama.includes(j));
        let newSteps = {
            pengajuan: "inactive",
            mou: "inactive",
            pelaksanaan: "inactive",
            laporan: "inactive",
            sertifikat: "inactive"
        };
        // 1. PENGAJUAN - Gunakan stable status
        if (statusPengajuan.includes("selesai") || // PENTING: Cek "selesai" dulu!
        statusPengajuan.includes("disetujui") || statusPengajuan.includes("ditolak")) {
            newSteps.pengajuan = "done";
        } else if (statusPengajuan.includes("menunggu")) {
            newSteps.pengajuan = "active";
        } else {
            newSteps.pengajuan = "active";
        }
        // 2. MOU - Hanya untuk workflow yang pakai MOU (PKL, Magang, Pelatihan)
        if (hasMouWorkflow) {
            if (statusMou.includes("disetujui") || statusMou.includes("ditolak")) {
                newSteps.mou = "done";
            } else if (statusMou.includes("menunggu") || layananData.mou?.id) {
                newSteps.mou = "active";
            } else if (statusPengajuan.includes("disetujui")) {
                // Pengajuan sudah disetujui tapi belum ada MOU, berarti MOU aktif
                newSteps.mou = "active";
            }
        }
        // 3. PELAKSANAAN - Hanya untuk workflow yang pakai MOU
        if (hasMouWorkflow) {
            if (statusPelaksanaan.includes("selesai")) {
                newSteps.pelaksanaan = "done";
            } else if (statusPelaksanaan.includes("berjalan") || statusPelaksanaan.includes("belum")) {
                // Jika MOU sudah disetujui, pelaksanaan jadi aktif
                if (statusMou.includes("disetujui")) {
                    newSteps.pelaksanaan = "active";
                }
            }
        }
        // 4. LAPORAN AKHIR - Untuk semua workflow
        if (hasLaporan) {
            newSteps.laporan = "done";
        } else {
            // Laporan jadi aktif kalau:
            // - Simple workflow: pengajuan disetujui
            // - MOU workflow: pelaksanaan selesai atau berjalan
            if (isSimpleWorkflow && statusPengajuan.includes("disetujui")) {
                newSteps.laporan = "active";
            } else if (hasMouWorkflow && (statusPelaksanaan.includes("selesai") || statusPelaksanaan.includes("berjalan"))) {
                newSteps.laporan = "active";
            }
        }
        // 5. SERTIFIKAT - HANYA untuk MOU workflow (PKL, Magang, Pelatihan)
        // Undangan Narasumber & Kunjungan TIDAK ada sertifikat
        if (hasMouWorkflow) {
            if (hasSertifikat) {
                newSteps.sertifikat = "done";
            } else if (hasLaporan) {
                // Kalau laporan sudah ada, sertifikat jadi aktif
                newSteps.sertifikat = "active";
            }
        }
        setSteps(newSteps);
    }, [
        layananData,
        displayPengajuanStatus,
        displayPelaksanaanStatus
    ]);
    // Auto-update display status ketika ada perubahan data yang signifikan
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!layananData || !isStatusInitialized) return;
        const laporanData = Array.isArray(layananData?.laporan) ? layananData.laporan[0] : layananData?.laporan;
        const hasLaporan = !!(laporanData?.id_laporan || laporanData?.id);
        // Jika laporan sudah ada, PAKSA status pelaksanaan jadi "Selesai"
        if (hasLaporan && displayPelaksanaanStatus !== "Selesai") {
            console.log("[ADMIN DEBUG] Forcing pelaksanaan to Selesai because laporan exists");
            setDisplayPelaksanaanStatus("Selesai");
        }
        // PENTING: Jika status pengajuan tiba-tiba berubah dari backend jadi "Berlangsung"
        // tapi sudah pernah "Disetujui", PAKSA kembali ke "Disetujui"
        const currentPengajuanFromBackend = layananData?.pengajuan?.nama_status_kode?.toLowerCase() || "";
        const currentDisplayLower = displayPengajuanStatus.toLowerCase();
        // UPGRADE: Jika backend return "Selesai", upgrade display status ke "Selesai" (status tertinggi)
        if (currentPengajuanFromBackend.includes("selesai") && !currentDisplayLower.includes("selesai")) {
            console.log("[ADMIN DEBUG] Upgrading pengajuan status to Selesai from backend");
            setDisplayPengajuanStatus("Selesai");
            return; // Stop further processing
        }
        // Jika backend return "berlangsung" tapi ada indikasi sudah disetujui
        if (currentPengajuanFromBackend.includes("berlangsung")) {
            // Cek: apakah sudah ada progress (MOU, pelaksanaan, atau display status sebelumnya "disetujui")
            const hasProgress = layananData?.mou?.id || layananData?.pelaksanaan?.id || currentDisplayLower.includes("disetujui") || currentDisplayLower.includes("selesai");
            if (hasProgress && !currentDisplayLower.includes("disetujui") && !currentDisplayLower.includes("selesai")) {
                console.log("[ADMIN DEBUG] Backend returned Berlangsung but has progress - forcing back to Disetujui");
                setDisplayPengajuanStatus("Disetujui");
            }
        }
        // Extra defense: Jika display status sudah "Disetujui" tapi backend coba override ke apapun
        // KECUALI "Ditolak" atau "Selesai" (status yang lebih tinggi)
        if (currentDisplayLower.includes("disetujui") && !currentPengajuanFromBackend.includes("disetujui") && !currentPengajuanFromBackend.includes("ditolak") && !currentPengajuanFromBackend.includes("selesai") // EXCEPTION: "Selesai" boleh override "Disetujui"
        ) {
            console.log("[ADMIN DEBUG] Protecting Disetujui status from backend override:", currentPengajuanFromBackend);
            setDisplayPengajuanStatus("Disetujui");
        }
    }, [
        layananData,
        isStatusInitialized,
        displayPengajuanStatus,
        displayPelaksanaanStatus
    ]);
    // Auto-refresh polling untuk sync data real-time
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!params?.id || loading) return;
        const pollInterval = setInterval(async ()=>{
            try {
                const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$layanan$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchLayananById"])(Number(params.id), {
                    include_jenis: true,
                    include_peserta: true,
                    include_mou: true,
                    include_sertifikat: true,
                    include_laporan: true,
                    include_rejection: true,
                    include_pengajuan: true,
                    include_pelaksanaan: true
                });
                setLayananData(data);
            } catch (err) {
                console.error("[Admin] Error polling:", err);
            }
        }, 10000); // 10 seconds - auto refresh untuk melihat perubahan dari user
        return ()=>clearInterval(pollInterval);
    }, [
        params?.id,
        loading
    ]);
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
                setDisplayPengajuanStatus("Disetujui");
                setDisplayPelaksanaanStatus("Belum Terlaksana");
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
                setDisplayPengajuanStatus("Ditolak");
                setDisplayPelaksanaanStatus("Ditolak");
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
    // Handle File Select for Sertifikat
    const handleSertifikatFileChange = (e)=>{
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Validate file type (PDF only)
            if (file.type !== "application/pdf") {
                __turbopack_context__.r("[project]/node_modules/sweetalert2/dist/sweetalert2.esm.all.js [app-ssr] (ecmascript, async loader)")(__turbopack_context__.i).then(({ default: Swal })=>{
                    Swal.fire({
                        icon: "error",
                        title: "File Tidak Valid",
                        text: "Hanya file PDF yang diperbolehkan",
                        confirmButtonColor: "#4E342E",
                        customClass: {
                            popup: "rounded-xl"
                        }
                    });
                });
                return;
            }
            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                __turbopack_context__.r("[project]/node_modules/sweetalert2/dist/sweetalert2.esm.all.js [app-ssr] (ecmascript, async loader)")(__turbopack_context__.i).then(({ default: Swal })=>{
                    Swal.fire({
                        icon: "error",
                        title: "File Terlalu Besar",
                        text: "Ukuran file maksimal 10MB",
                        confirmButtonColor: "#4E342E",
                        customClass: {
                            popup: "rounded-xl"
                        }
                    });
                });
                return;
            }
            setSertifikatFile(file);
        }
    };
    // Handle Upload Sertifikat
    const handleUploadSertifikat = async ()=>{
        console.log("=== handleUploadSertifikat called ===");
        console.log("layananData:", layananData?.id);
        console.log("sertifikatFile:", sertifikatFile?.name);
        if (!layananData || !sertifikatFile) {
            console.log("Validation failed - missing data");
            return;
        }
        const Swal = (await __turbopack_context__.r("[project]/node_modules/sweetalert2/dist/sweetalert2.esm.all.js [app-ssr] (ecmascript, async loader)")(__turbopack_context__.i)).default;
        const result = await Swal.fire({
            title: "Upload Sertifikat?",
            text: "Pastikan file sertifikat sudah benar",
            icon: "question",
            showCancelButton: true,
            cancelButtonText: "Batal",
            confirmButtonText: "Ya, Upload",
            confirmButtonColor: "#4E342E",
            customClass: {
                popup: "rounded-xl"
            }
        });
        console.log("SweetAlert result:", result.isConfirmed);
        if (result.isConfirmed) {
            try {
                console.log("Starting upload process...");
                setUploadingSertifikat(true);
                Swal.fire({
                    title: "Mengupload...",
                    text: "Mohon tunggu sebentar",
                    allowOutsideClick: false,
                    didOpen: ()=>{
                        Swal.showLoading();
                    }
                });
                console.log("Calling createSertifikat API...");
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$sertifikat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSertifikat"])({
                    id_layanan: layananData.id,
                    link_sertifikat: sertifikatLink || undefined,
                    file_sertifikat: sertifikatFile
                });
                console.log("Upload successful, reloading data...");
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
                // Reset form
                setSertifikatFile(null);
                setSertifikatLink("");
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                // Get jenis layanan name
                const jenisLayananName = updated?.jenisLayanan?.nama_jenis_layanan || updated?.jenis_layanan?.nama_jenis_layanan || layananData?.jenisLayanan?.nama_jenis_layanan || layananData?.jenis_layanan?.nama_jenis_layanan || "kegiatan ini";
                await Swal.fire({
                    icon: "success",
                    title: "Sertifikat Berhasil Diupload",
                    text: `Sertifikat untuk ${jenisLayananName} telah tersedia dan dapat diunduh oleh peserta.`,
                    confirmButtonColor: "#4E342E",
                    customClass: {
                        popup: "rounded-xl"
                    }
                });
            } catch (error) {
                await Swal.fire({
                    icon: "error",
                    title: "Gagal Upload Sertifikat",
                    text: error.message || "Terjadi kesalahan",
                    confirmButtonColor: "#4E342E",
                    customClass: {
                        popup: "rounded-xl"
                    }
                });
            } finally{
                setUploadingSertifikat(false);
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
            className: `flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 ${status === "active" ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 shadow-sm" : status === "done" ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300" : "bg-gray-50 border-gray-200 opacity-50"}`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `shrink-0 h-9 w-9 grid place-items-center rounded-lg transition-all ${status === "active" ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md animate-pulse" : status === "done" ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white" : "bg-gray-300 text-gray-500"}`,
                    children: icon
                }, void 0, false, {
                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                    lineNumber: 893,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `text-sm font-semibold ${status === "active" ? "text-blue-900" : status === "done" ? "text-green-900" : "text-gray-500"}`,
                    children: label
                }, void 0, false, {
                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                    lineNumber: 904,
                    columnNumber: 7
                }, this),
                status === "done" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "ml-auto inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                            size: 12
                        }, void 0, false, {
                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                            lineNumber: 917,
                            columnNumber: 11
                        }, this),
                        " Selesai"
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                    lineNumber: 916,
                    columnNumber: 9
                }, this),
                status === "active" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "ml-auto inline-flex items-center gap-1 text-xs font-semibold text-blue-700",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-2 w-2 bg-blue-600 rounded-full animate-pulse"
                        }, void 0, false, {
                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                            lineNumber: 922,
                            columnNumber: 11
                        }, this),
                        " ",
                        "Berlangsung"
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                    lineNumber: 921,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
            lineNumber: 884,
            columnNumber: 5
        }, this);
    // Loading state
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full px-4 md:px-6 py-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.back(),
                        className: "mb-4 cursor-pointer bg-amber-950 text-white px-3 py-2 rounded-xl flex items-center gap-1 hover:-translate-y-1 duration-150 ease-in text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                size: 18
                            }, void 0, false, {
                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                lineNumber: 938,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Kembali"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                lineNumber: 939,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                        lineNumber: 934,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-pulse space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-8 bg-gray-200 rounded w-1/4"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                lineNumber: 942,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-64 bg-gray-200 rounded"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                lineNumber: 943,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-96 bg-gray-200 rounded"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                lineNumber: 944,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                        lineNumber: 941,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                lineNumber: 933,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
            lineNumber: 932,
            columnNumber: 7
        }, this);
    }
    // Error state
    if (error || !layananData) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full px-4 md:px-6 py-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.back(),
                        className: "mb-4 cursor-pointer bg-amber-950 text-white px-3 py-2 rounded-xl flex items-center gap-1 hover:-translate-y-1 duration-150 ease-in text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                size: 18
                            }, void 0, false, {
                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                lineNumber: 960,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Kembali"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                lineNumber: 961,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                        lineNumber: 956,
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
                                lineNumber: 964,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-red-600 mb-4",
                                children: error || "Data layanan tidak ditemukan"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                lineNumber: 967,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>router.back(),
                                className: "inline-flex items-center rounded-lg bg-red-600 text-white px-4 py-2 hover:bg-red-700",
                                children: "Kembali"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                lineNumber: 970,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                        lineNumber: 963,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                lineNumber: 955,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
            lineNumber: 954,
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
    // Compute display status untuk UI yang lebih akurat
    // PENTING: Gunakan state yang stable, bukan langsung dari backend
    const getDisplayPengajuanStatus = ()=>{
        // Jika sudah ada display status yang di-set, gunakan itu (FINAL)
        if (displayPengajuanStatus) {
            const lower = displayPengajuanStatus.toLowerCase();
            // Status final tidak boleh berubah
            if (lower.includes("ditolak")) return "Ditolak";
            if (lower.includes("disetujui")) return "Disetujui";
            // Jika backend tiba-tiba return "berlangsung" tapi sudah ada progress, override ke "Disetujui"
            if (lower.includes("berlangsung") && (layananData?.mou?.id || layananData?.pelaksanaan)) {
                return "Disetujui";
            }
            return displayPengajuanStatus;
        }
        // Fallback ke backend (hanya untuk initial render)
        const rawStatus = layananData?.pengajuan?.nama_status_kode || "-";
        return rawStatus;
    };
    const getDisplayPelaksanaanStatus = ()=>{
        // Untuk workflow simple (Kunjungan, Undangan Narasumber), skip pelaksanaan
        if (isSimpleWorkflow) return "-";
        const laporanData = Array.isArray(layananData?.laporan) ? layananData.laporan[0] : layananData?.laporan;
        const hasLaporan = !!(laporanData?.id_laporan || laporanData?.id);
        // Jika laporan sudah ada, pelaksanaan PASTI selesai (FINAL)
        if (hasLaporan) return "Selesai";
        // Gunakan stable state jika ada
        if (displayPelaksanaanStatus) {
            const lower = displayPelaksanaanStatus.toLowerCase();
            // Status final
            if (lower.includes("selesai")) return "Selesai";
            if (lower.includes("ditolak")) return "Ditolak";
            // Status in-progress
            if (lower.includes("berjalan") || lower.includes("berlangsung")) return "Berlangsung";
            return displayPelaksanaanStatus;
        }
        // Fallback ke backend status
        if (statusPelaksanaan.includes("selesai")) return "Selesai";
        if (statusPelaksanaan.includes("berjalan")) return "Berlangsung";
        if (statusPelaksanaan.includes("ditolak")) return "Ditolak";
        // Untuk MOU workflow, cek apakah MOU sudah disetujui
        if (hasMouWorkflow) {
            const statusMou = layananData?.mou?.statusKode?.nama_status_kode?.toLowerCase() || "";
            if (statusMou.includes("disetujui")) {
                return "Belum Terlaksana";
            }
        }
        return layananData?.pelaksanaan?.nama_status_kode || "-";
    };
    // Determine if MOU is in pending state (can approve/reject)
    const isMouPending = layananData?.mou?.statusKode?.nama_status_kode?.toLowerCase().includes("menunggu") && !layananData?.mou?.statusKode?.nama_status_kode?.toLowerCase().includes("disetujui") && !layananData?.mou?.statusKode?.nama_status_kode?.toLowerCase().includes("ditolak");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full px-4 md:px-6 py-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>router.back(),
                    className: "mb-4 cursor-pointer bg-amber-950 text-white px-3 py-2 rounded-xl flex items-center gap-1 hover:-translate-y-1 duration-150 ease-in text-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                            size: 18
                        }, void 0, false, {
                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                            lineNumber: 1104,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "Kembali"
                        }, void 0, false, {
                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                            lineNumber: 1105,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                    lineNumber: 1100,
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
                            lineNumber: 1108,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-gray-500 text-center mt-1",
                            children: "Ringkasan kegiatan yang diikuti peserta di Sekolah Kopi Raisa"
                        }, void 0, false, {
                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                            lineNumber: 1109,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                    lineNumber: 1107,
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
                                        lineNumber: 1118,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                    lineNumber: 1117,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-center font-semibold mt-3",
                                    children: "Progres Kegiatan"
                                }, void 0, false, {
                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                    lineNumber: 1120,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-center text-xs text-gray-500 mb-4",
                                    children: "Pantau Status Pelaksanaan Kegiatan Anda"
                                }, void 0, false, {
                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                    lineNumber: 1121,
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
                                                lineNumber: 1127,
                                                columnNumber: 23
                                            }, void 0),
                                            status: steps.pengajuan
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 1125,
                                            columnNumber: 15
                                        }, this),
                                        isSimpleWorkflow ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StepItem, {
                                            label: "Laporan Akhir",
                                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                size: 16
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                lineNumber: 1135,
                                                columnNumber: 25
                                            }, void 0),
                                            status: steps.laporan
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 1133,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StepItem, {
                                                    label: "MOU",
                                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                                        size: 16
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1143,
                                                        columnNumber: 27
                                                    }, void 0),
                                                    status: steps.mou
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1141,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StepItem, {
                                                    label: "Pelaksanaan",
                                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__["ClipboardList"], {
                                                        size: 16
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1148,
                                                        columnNumber: 27
                                                    }, void 0),
                                                    status: steps.pelaksanaan
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1146,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StepItem, {
                                                    label: "Laporan Akhir",
                                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                        size: 16
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1153,
                                                        columnNumber: 27
                                                    }, void 0),
                                                    status: steps.laporan
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1151,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StepItem, {
                                                    label: "Sertifikat Kegiatan",
                                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__["Award"], {
                                                        size: 16
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1158,
                                                        columnNumber: 27
                                                    }, void 0),
                                                    status: steps.sertifikat
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1156,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                    lineNumber: 1124,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                            lineNumber: 1116,
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
                                                    lineNumber: 1170,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-gray-600",
                                                    children: "Detail Informasi dan Dokumen yang telah anda Submit"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1173,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 1169,
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
                                                            lineNumber: 1180,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `px-3 py-1 text-xs font-medium rounded-full ${(getDisplayPengajuanStatus() || "").toLowerCase().includes("disetujui") ? "bg-green-100 text-green-700" : (getDisplayPengajuanStatus() || "").toLowerCase().includes("ditolak") ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`,
                                                            children: getDisplayPengajuanStatus()
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 1183,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1179,
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
                                                            lineNumber: 1202,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `px-3 py-1 text-xs font-medium rounded-full ${(getDisplayPelaksanaanStatus() || "").toLowerCase().includes("selesai") ? "bg-green-100 text-green-700" : (getDisplayPelaksanaanStatus() || "").toLowerCase().includes("berlangsung") ? "bg-blue-100 text-blue-700" : (getDisplayPelaksanaanStatus() || "").toLowerCase().includes("ditolak") ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`,
                                                            children: getDisplayPelaksanaanStatus()
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 1205,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1201,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 1178,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                    lineNumber: 1168,
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
                                                    lineNumber: 1231,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm",
                                                    children: jenisNama || "-"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1232,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 1230,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-500",
                                                    children: "Tanggal Mulai"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1235,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm",
                                                    children: layananData.tanggal_mulai ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$layanan$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(layananData.tanggal_mulai) : "-"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1236,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 1234,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-500",
                                                    children: "Nama Peserta"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1243,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm",
                                                    children: pesertaInfo?.nama_peserta || pesertaInfo?.nama || layananData.pemohon?.name || "-"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1244,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 1242,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-500",
                                                    children: "Tanggal Selesai"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1252,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm",
                                                    children: layananData.tanggal_selesai ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$layanan$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(layananData.tanggal_selesai) : "-"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1253,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 1251,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-500",
                                                    children: "Instansi"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1260,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm",
                                                    children: layananData.instansi_asal || "-"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1261,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 1259,
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
                                                            lineNumber: 1267,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm",
                                                            children: layananData.nama_kegiatan || "-"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 1268,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1266,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-gray-500",
                                                            children: "Tempat Kegiatan"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 1273,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm",
                                                            children: layananData.tempat_kegiatan || "-"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 1274,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1272,
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
                                                    lineNumber: 1281,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm",
                                                    children: layananData.kegiatan?.map((k)=>k.nama_kegiatan).join(", ") || "-"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1282,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 1280,
                                            columnNumber: 17
                                        }, this) : null
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                    lineNumber: 1229,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm font-semibold mb-3",
                                            children: "Dokumen yang diupload"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 1293,
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
                                                                        lineNumber: 1304,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 1303,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm font-medium",
                                                                            children: "Proposal"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 1307,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs text-gray-500",
                                                                            children: "Proposal.pdf"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 1308,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 1306,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 1302,
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
                                                                            lineNumber: 1318,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        " Lihat"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 1312,
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
                                                                            lineNumber: 1329,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        " Download"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 1320,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 1311,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1301,
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
                                                                        lineNumber: 1342,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 1341,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm font-medium",
                                                                            children: "Proposal / Surat Permohonan"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 1345,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs text-gray-500",
                                                                            children: "ProposalSuratPermohonan.pdf"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 1348,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 1344,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 1340,
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
                                                                            lineNumber: 1365,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        " Lihat"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 1354,
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
                                                                            lineNumber: 1379,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        " Download"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 1367,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 1353,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1339,
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
                                                                        lineNumber: 1390,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 1389,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm font-medium",
                                                                            children: "Surat Pengantar"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 1393,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs text-gray-500",
                                                                            children: "SuratPengantar.pdf"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 1394,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 1392,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 1388,
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
                                                                            lineNumber: 1408,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        " Lihat"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 1400,
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
                                                                            lineNumber: 1419,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        " Download"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 1410,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 1399,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1387,
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
                                                                        lineNumber: 1430,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 1429,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm font-medium",
                                                                            children: "Surat Undangan"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 1433,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs text-gray-500",
                                                                            children: "SuratUndangan.pdf"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 1434,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 1432,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 1428,
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
                                                                            lineNumber: 1448,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        " Lihat"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 1440,
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
                                                                            lineNumber: 1459,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        " Download"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 1450,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 1439,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1427,
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
                                                                        lineNumber: 1470,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 1469,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm font-medium",
                                                                            children: "MOU"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 1473,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs text-gray-500",
                                                                            children: "MOU.pdf"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 1474,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        layananData.mou.statusKode?.nama_status_kode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: `text-xs ${layananData.mou.statusKode.nama_status_kode.toLowerCase().includes("disetujui") ? "text-green-600" : layananData.mou.statusKode.nama_status_kode.toLowerCase().includes("ditolak") ? "text-red-600" : "text-yellow-600"}`,
                                                                            children: layananData.mou.statusKode.nama_status_kode
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 1476,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 1472,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 1468,
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
                                                                            lineNumber: 1501,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        " Lihat"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 1495,
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
                                                                            lineNumber: 1512,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        " Download"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 1503,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 1494,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1467,
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
                                                                lineNumber: 1532,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-red-600 whitespace-pre-wrap",
                                                                children: alasan
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                lineNumber: 1535,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1531,
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
                                                            lineNumber: 1545,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-red-600 whitespace-pre-wrap",
                                                            children: layananData.mou.mouRejection.alasan
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 1548,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1544,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 1296,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                    lineNumber: 1292,
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
                                            lineNumber: 1560,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-amber-900 text-white hover:bg-amber-950",
                                            onClick: handleApprovePengajuan,
                                            children: "✓ Setujui Pengajuan"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 1567,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                    lineNumber: 1558,
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
                                                                lineNumber: 1589,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 1583,
                                                            columnNumber: 23
                                                        }, this),
                                                        "MOU Upload Ulang (Revisi)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1582,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-500 mt-1",
                                                    children: "User telah mengupload ulang MOU setelah sebelumnya ditolak"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1598,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 1581,
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
                                                    lineNumber: 1606,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-amber-900 text-white hover:bg-amber-950",
                                                    onClick: handleApproveMou,
                                                    children: "✓ Setujui MOU"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1613,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 1604,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                            lineNumber: 1167,
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
                                                        lineNumber: 1630,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1629,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: "text-lg font-semibold",
                                                            children: "Logbook Kegiatan"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 1633,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-600",
                                                            children: "Link logbook yang telah disubmit oleh peserta"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 1634,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1632,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 1628,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 border border-blue-200",
                                            children: "✓ Tersedia"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 1639,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                    lineNumber: 1627,
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
                                            lineNumber: 1645,
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
                                            lineNumber: 1646,
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
                                                        lineNumber: 1661,
                                                        columnNumber: 21
                                                    }, this),
                                                    " Buka Logbook"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                lineNumber: 1655,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 1654,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                    lineNumber: 1644,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                            lineNumber: 1626,
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
                                                            lineNumber: 1684,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1683,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "text-lg font-semibold",
                                                                children: "Laporan Akhir Kegiatan"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                lineNumber: 1687,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-gray-600",
                                                                children: "Laporan yang telah disubmit oleh peserta"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                lineNumber: 1690,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1686,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                lineNumber: 1682,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 border border-green-200",
                                                children: "✓ Telah Terisi"
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                lineNumber: 1695,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                        lineNumber: 1681,
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
                                                        lineNumber: 1703,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700",
                                                        children: laporanData?.nama_p4s || "-"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1706,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                lineNumber: 1702,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700 mb-1",
                                                        children: "Asal Kab/Kota"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1713,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700",
                                                        children: laporanData?.asal_kab_kota || "-"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1716,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                lineNumber: 1712,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700 mb-1",
                                                        children: "Jenis Kegiatan"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1723,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700",
                                                        children: jenisNama || "-"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1726,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                lineNumber: 1722,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700 mb-1",
                                                        children: "Asal Peserta"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1733,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700",
                                                        children: layananData?.instansi_asal || "-"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1736,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                lineNumber: 1732,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700 mb-1",
                                                        children: "Jumlah Peserta"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1743,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700",
                                                        children: [
                                                            layananData?.jumlah_peserta || "-",
                                                            " orang"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1746,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                lineNumber: 1742,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700 mb-1",
                                                        children: "Tanggal Pelaksanaan"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1753,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700",
                                                        children: layananData?.tanggal_mulai ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$layanan$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(layananData.tanggal_mulai) : "-"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1756,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                lineNumber: 1752,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700 mb-1",
                                                        children: "Lama Pelaksanaan"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1765,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700",
                                                        children: "1 hari"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1768,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                lineNumber: 1764,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700 mb-2",
                                                        children: "Foto Kegiatan"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1775,
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
                                                                                lineNumber: 1783,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 1782,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-sm font-medium text-green-800",
                                                                                    children: "Foto Kegiatan Telah Diupload"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                                    lineNumber: 1786,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-xs text-green-600",
                                                                                    children: "FotoKegiatan.jpg"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                                    lineNumber: 1789,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 1785,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 1781,
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
                                                                                    lineNumber: 1799,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                " Lihat"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 1795,
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
                                                                                    lineNumber: 1807,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                " Download"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 1801,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 1794,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 1780,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1779,
                                                        columnNumber: 23
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm text-gray-500 italic",
                                                        children: "Tidak ada foto yang diupload"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1813,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                lineNumber: 1774,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                        lineNumber: 1700,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                lineNumber: 1680,
                                columnNumber: 15
                            }, this);
                        })(),
                        hasMouWorkflow && (()=>{
                            const laporanData = Array.isArray(layananData?.laporan) ? layananData.laporan[0] : layananData?.laporan;
                            const hasLaporan = !!(laporanData?.id_laporan || laporanData?.id);
                            const sertifikatData = Array.isArray(layananData?.sertifikat) ? layananData.sertifikat[0] : layananData?.sertifikat;
                            const hasSertifikat = !!(sertifikatData?.id || sertifikatData?.file_sertifikat);
                            // Hanya tampilkan section sertifikat jika sudah ada laporan
                            if (!hasLaporan) return null;
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
                                                        className: "h-12 w-12 grid place-items-center rounded-xl bg-amber-100 text-amber-700",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__["Award"], {
                                                            size: 24
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 1847,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1846,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "text-lg font-semibold",
                                                                children: "Sertifikat Kegiatan"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                lineNumber: 1850,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-gray-600",
                                                                children: hasSertifikat ? "Sertifikat telah diupload" : "Upload sertifikat untuk peserta"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                lineNumber: 1853,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1849,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                lineNumber: 1845,
                                                columnNumber: 21
                                            }, this),
                                            hasSertifikat && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 border border-green-200",
                                                children: "✓ Tersedia"
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                lineNumber: 1861,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                        lineNumber: 1844,
                                        columnNumber: 19
                                    }, this),
                                    hasSertifikat ? // Tampilkan sertifikat yang sudah diupload
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-gray-50 rounded-lg p-4 space-y-3",
                                        children: [
                                            sertifikatData?.file_sertifikat && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-white rounded-xl border border-gray-100 p-3 flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "h-10 w-10 grid place-items-center rounded-md bg-amber-200 text-amber-700",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__["Award"], {
                                                                    size: 20
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 1875,
                                                                    columnNumber: 31
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                lineNumber: 1874,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm font-medium",
                                                                        children: "Sertifikat Kegiatan (File)"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                        lineNumber: 1878,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs text-gray-500",
                                                                        children: "Sertifikat.pdf"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                        lineNumber: 1881,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                lineNumber: 1877,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1873,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>{
                                                                    const url = sertifikatData?.file_sertifikat;
                                                                    if (url) {
                                                                        const fullUrl = url.startsWith("http") ? url : `${("TURBOPACK compile-time value", "https://be-web-sekolah-kopi-raisa.vercel.app") || ""}${url}`;
                                                                        window.open(fullUrl, "_blank");
                                                                    }
                                                                },
                                                                className: "px-3 py-1.5 text-xs rounded-md border border-gray-200 hover:bg-gray-50 flex items-center gap-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                        size: 14
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                        lineNumber: 1901,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    " Lihat"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                lineNumber: 1887,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>{
                                                                    const url = sertifikatData?.file_sertifikat;
                                                                    if (url) {
                                                                        const fullUrl = url.startsWith("http") ? url : `${("TURBOPACK compile-time value", "https://be-web-sekolah-kopi-raisa.vercel.app") || ""}${url}`;
                                                                        const link = document.createElement("a");
                                                                        link.href = fullUrl;
                                                                        link.download = "Sertifikat.pdf";
                                                                        link.click();
                                                                    }
                                                                },
                                                                className: "px-3 py-1.5 text-xs rounded-md bg-gray-100 hover:bg-gray-200 flex items-center gap-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                                        size: 14
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                        lineNumber: 1920,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    " Download"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                lineNumber: 1903,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1886,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                lineNumber: 1872,
                                                columnNumber: 25
                                            }, this),
                                            sertifikatData?.link_sertifikat && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-white rounded-lg border border-gray-100 p-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2 mb-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__["Award"], {
                                                                size: 16,
                                                                className: "text-amber-700"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                lineNumber: 1930,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs font-medium text-gray-700",
                                                                children: "Link Sertifikat:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                lineNumber: 1931,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1929,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        href: sertifikatData.link_sertifikat,
                                                        target: "_blank",
                                                        rel: "noopener noreferrer",
                                                        className: "text-sm text-blue-600 hover:text-blue-800 hover:underline break-all",
                                                        children: sertifikatData.link_sertifikat
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1935,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-2",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                            href: sertifikatData.link_sertifikat,
                                                            target: "_blank",
                                                            rel: "noopener noreferrer",
                                                            className: "inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                    size: 14
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 1950,
                                                                    columnNumber: 31
                                                                }, this),
                                                                " Buka Link"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 1944,
                                                            columnNumber: 29
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 1943,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                lineNumber: 1928,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                        lineNumber: 1869,
                                        columnNumber: 21
                                    }, this) : // Form upload sertifikat
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-gray-50 rounded-lg p-4",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-sm font-medium text-gray-700 mb-1",
                                                            children: "Link Sertifikat (Opsional)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 1962,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "url",
                                                            value: sertifikatLink,
                                                            onChange: (e)=>setSertifikatLink(e.target.value),
                                                            placeholder: "https://...",
                                                            className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 1965,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1961,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-sm font-medium text-gray-700 mb-1",
                                                            children: [
                                                                "File Sertifikat (PDF)",
                                                                " ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-red-500",
                                                                    children: "*"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 1978,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 1976,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            ref: fileInputRef,
                                                            type: "file",
                                                            accept: ".pdf",
                                                            onChange: handleSertifikatFileChange,
                                                            className: "hidden"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 1980,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>fileInputRef.current?.click(),
                                                                    className: "inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                                                            size: 16
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                            lineNumber: 1992,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        " Pilih File"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 1988,
                                                                    columnNumber: 29
                                                                }, this),
                                                                sertifikatFile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-sm text-gray-600",
                                                                    children: sertifikatFile.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                    lineNumber: 1995,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 1987,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-gray-500 mt-1",
                                                            children: "Format: PDF, Maksimal 10MB"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                            lineNumber: 2000,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 1975,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-end",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: handleUploadSertifikat,
                                                        disabled: !sertifikatFile || uploadingSertifikat,
                                                        className: `inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-md text-white ${!sertifikatFile || uploadingSertifikat ? "bg-gray-400 cursor-not-allowed" : "bg-amber-900 hover:bg-amber-950"}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__["Award"], {
                                                                size: 16
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                                lineNumber: 2016,
                                                                columnNumber: 29
                                                            }, this),
                                                            uploadingSertifikat ? "Mengupload..." : "Upload Sertifikat"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                        lineNumber: 2007,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                                    lineNumber: 2006,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                            lineNumber: 1959,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                        lineNumber: 1958,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                                lineNumber: 1843,
                                columnNumber: 17
                            }, this);
                        })()
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
                    lineNumber: 1114,
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
                    lineNumber: 2030,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
            lineNumber: 1099,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/admin/layanan/monitoring/[id]/page.tsx",
        lineNumber: 1098,
        columnNumber: 5
    }, this);
}
}}),

};

//# sourceMappingURL=app_54ea82f5._.js.map