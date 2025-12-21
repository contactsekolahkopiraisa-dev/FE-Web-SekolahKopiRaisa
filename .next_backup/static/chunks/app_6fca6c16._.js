(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/app_6fca6c16._.js", {

"[project]/app/utils/modul.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "createModul": (()=>createModul),
    "deleteModul": (()=>deleteModul),
    "fetchAllModul": (()=>fetchAllModul),
    "fetchModulById": (()=>fetchModulById),
    "updateModul": (()=>updateModul)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/api.ts [app-client] (ecmascript)");
;
const fetchAllModul = async ()=>{
    try {
        console.log("Fetching moduls from API...");
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/api/v1/modul");
        console.log("Modul response:", response);
        console.log("Modul data:", response.data);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching modul:", error);
        console.error("Error response:", error.response);
        console.error("Error message:", error.message);
        throw new Error(error.response?.data?.message || "Gagal mengambil data modul");
    }
};
const fetchModulById = async (id)=>{
    try {
        console.log("Fetching modul by id:", id);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/api/v1/modul/${id}`);
        console.log("Modul by id response:", response.data);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching modul by id:", error);
        console.error("Error response:", error.response);
        throw new Error(error.response?.data?.message || "Gagal mengambil detail modul");
    }
};
const createModul = async (formData)=>{
    try {
        const data = new FormData();
        data.append("judul_modul", formData.judul_modul);
        data.append("deskripsi", formData.deskripsi);
        if (formData.file_modul) {
            data.append("file_modul", formData.file_modul);
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/api/v1/modul", data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data.data;
    } catch (error) {
        console.error("Error creating modul:", error);
        throw new Error(error.response?.data?.message || "Gagal menambahkan modul");
    }
};
const updateModul = async (id, formData)=>{
    try {
        const data = new FormData();
        data.append("judul_modul", formData.judul_modul);
        data.append("deskripsi", formData.deskripsi);
        if (formData.file_modul) {
            data.append("file_modul", formData.file_modul);
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/api/v1/modul/${id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data.data;
    } catch (error) {
        console.error("Error updating modul:", error);
        throw new Error(error.response?.data?.message || "Gagal memperbarui modul");
    }
};
const deleteModul = async (id)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/api/v1/modul/${id}`);
    } catch (error) {
        console.error("Error deleting modul:", error);
        throw new Error(error.response?.data?.message || "Gagal menghapus modul");
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/admin/layanan/modul/edit/[id]/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>EditModulPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sweetalert2/dist/sweetalert2.all.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$modul$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/modul.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function EditModulPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        judul_modul: "",
        deskripsi: ""
    });
    const [moduleFile, setModuleFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [currentFileUrl, setCurrentFileUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Fetch module data on mount
    const fetchModule = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "EditModulPage.useCallback[fetchModule]": async ()=>{
            try {
                if (!params.id) {
                    console.warn("params.id is undefined");
                    throw new Error("ID modul tidak ditemukan");
                }
                console.log("Fetching module with ID:", params.id);
                const moduleData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$modul$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchModulById"])(Number(params.id));
                console.log("Module data loaded:", moduleData);
                setFormData({
                    judul_modul: moduleData.judul_modul,
                    deskripsi: moduleData.deskripsi
                });
                setCurrentFileUrl(moduleData.file_modul);
            } catch (error) {
                console.error("Error fetching module:", error);
                await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].fire({
                    icon: "error",
                    title: "Gagal Memuat Data",
                    text: error.message || "Terjadi kesalahan saat memuat data modul",
                    confirmButtonColor: "#4E342E",
                    customClass: {
                        popup: "rounded-xl"
                    }
                });
                router.push("/admin/layanan/modul");
            } finally{
                setIsLoading(false);
            }
        }
    }["EditModulPage.useCallback[fetchModule]"], [
        params.id,
        router
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EditModulPage.useEffect": ()=>{
            console.log("useEffect triggered, params.id:", params.id);
            if (params.id) {
                fetchModule();
            } else {
                console.warn("params.id is undefined in useEffect");
                setIsLoading(false);
            }
        }
    }["EditModulPage.useEffect"], [
        params.id,
        fetchModule
    ]);
    const handleInputChange = (e)=>{
        const { name, value } = e.target;
        setFormData((prev)=>({
                ...prev,
                [name]: value
            }));
    };
    const handleModuleFileChange = (e)=>{
        const file = e.target.files?.[0];
        if (file) {
            setModuleFile(file);
        }
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!params.id) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].fire({
                icon: "error",
                title: "Error",
                text: "ID modul tidak valid",
                confirmButtonColor: "#4E342E",
                customClass: {
                    popup: "rounded-xl"
                }
            });
            return;
        }
        setIsSubmitting(true);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$modul$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateModul"])(Number(params.id), {
                judul_modul: formData.judul_modul,
                deskripsi: formData.deskripsi,
                file_modul: moduleFile || undefined
            });
            await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].fire({
                icon: "success",
                title: "Modul Berhasil Diperbarui",
                confirmButtonColor: "#4E342E",
                customClass: {
                    popup: "rounded-xl"
                }
            });
            router.push("/admin/layanan/modul");
        } catch (error) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].fire({
                icon: "error",
                title: "Gagal Memperbarui Modul",
                text: error.message || "Silakan coba lagi.",
                confirmButtonColor: "#4E342E",
                customClass: {
                    popup: "rounded-xl"
                }
            });
        } finally{
            setIsSubmitting(false);
        }
    };
    const handleCancel = ()=>{
        router.back();
    };
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-neutral-50 flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-gray-600",
                children: "Memuat..."
            }, void 0, false, {
                fileName: "[project]/app/admin/layanan/modul/edit/[id]/page.tsx",
                lineNumber: 130,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/admin/layanan/modul/edit/[id]/page.tsx",
            lineNumber: 129,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-neutral-50 p-4 md:p-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-4xl mx-auto",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-xl shadow-sm p-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-semibold text-gray-900 mb-8",
                        children: "Edit Modul"
                    }, void 0, false, {
                        fileName: "[project]/app/admin/layanan/modul/edit/[id]/page.tsx",
                        lineNumber: 139,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleSubmit,
                        className: "space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "judul_modul",
                                        className: "block text-sm font-medium text-amber-900 mb-2",
                                        children: "Judul Modul"
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/layanan/modul/edit/[id]/page.tsx",
                                        lineNumber: 146,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        id: "judul_modul",
                                        name: "judul_modul",
                                        value: formData.judul_modul,
                                        onChange: handleInputChange,
                                        required: true,
                                        className: "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition",
                                        placeholder: "Contoh : 'Modul 1 : Pengenalan Kopi'"
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/layanan/modul/edit/[id]/page.tsx",
                                        lineNumber: 152,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/admin/layanan/modul/edit/[id]/page.tsx",
                                lineNumber: 145,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "deskripsi",
                                        className: "block text-sm font-medium text-amber-900 mb-2",
                                        children: "Deskripsi Singkat"
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/layanan/modul/edit/[id]/page.tsx",
                                        lineNumber: 166,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        id: "deskripsi",
                                        name: "deskripsi",
                                        value: formData.deskripsi,
                                        onChange: handleInputChange,
                                        required: true,
                                        className: "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition",
                                        placeholder: "Deskripsi singkat modul yang ditampilkan"
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/layanan/modul/edit/[id]/page.tsx",
                                        lineNumber: 172,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/admin/layanan/modul/edit/[id]/page.tsx",
                                lineNumber: 165,
                                columnNumber: 13
                            }, this),
                            currentFileUrl && !moduleFile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-amber-900 mb-2",
                                        children: "File Modul Saat Ini"
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/layanan/modul/edit/[id]/page.tsx",
                                        lineNumber: 187,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: currentFileUrl,
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        className: "inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                                size: 16
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/layanan/modul/edit/[id]/page.tsx",
                                                lineNumber: 196,
                                                columnNumber: 19
                                            }, this),
                                            "Lihat file modul saat ini"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/admin/layanan/modul/edit/[id]/page.tsx",
                                        lineNumber: 190,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/admin/layanan/modul/edit/[id]/page.tsx",
                                lineNumber: 186,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-amber-900 mb-2",
                                        children: [
                                            "Modul",
                                            " ",
                                            moduleFile ? "(File Baru)" : "(Opsional - Kosongkan jika tidak ingin mengubah)"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/admin/layanan/modul/edit/[id]/page.tsx",
                                        lineNumber: 204,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "module-upload",
                                        className: "flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition bg-neutral-50",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col items-center justify-center py-6",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                                        className: "w-10 h-10 text-gray-400 mb-2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/modul/edit/[id]/page.tsx",
                                                        lineNumber: 215,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-gray-500 font-medium",
                                                        children: moduleFile ? "File Dipilih" : "Unggah File Baru (Opsional)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/modul/edit/[id]/page.tsx",
                                                        lineNumber: 216,
                                                        columnNumber: 19
                                                    }, this),
                                                    moduleFile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-gray-400 mt-1",
                                                        children: moduleFile.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/layanan/modul/edit/[id]/page.tsx",
                                                        lineNumber: 222,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/admin/layanan/modul/edit/[id]/page.tsx",
                                                lineNumber: 214,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                id: "module-upload",
                                                type: "file",
                                                accept: ".pdf,.doc,.docx",
                                                className: "hidden",
                                                onChange: handleModuleFileChange
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/layanan/modul/edit/[id]/page.tsx",
                                                lineNumber: 227,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/admin/layanan/modul/edit/[id]/page.tsx",
                                        lineNumber: 210,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/admin/layanan/modul/edit/[id]/page.tsx",
                                lineNumber: 203,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-4 pt-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        disabled: isSubmitting,
                                        className: "px-8 py-2.5 bg-amber-900 text-white rounded-lg hover:bg-amber-950 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed",
                                        children: isSubmitting ? "Menyimpan..." : "Simpan"
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/layanan/modul/edit/[id]/page.tsx",
                                        lineNumber: 239,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: handleCancel,
                                        disabled: isSubmitting,
                                        className: "px-8 py-2.5 bg-white border border-amber-900 text-amber-900 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed",
                                        children: "Batal"
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/layanan/modul/edit/[id]/page.tsx",
                                        lineNumber: 246,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/admin/layanan/modul/edit/[id]/page.tsx",
                                lineNumber: 238,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/layanan/modul/edit/[id]/page.tsx",
                        lineNumber: 143,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/layanan/modul/edit/[id]/page.tsx",
                lineNumber: 138,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/admin/layanan/modul/edit/[id]/page.tsx",
            lineNumber: 137,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/admin/layanan/modul/edit/[id]/page.tsx",
        lineNumber: 136,
        columnNumber: 5
    }, this);
}
_s(EditModulPage, "hqgkfsMZunb2jCz/TLgwHBoZNZc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"]
    ];
});
_c = EditModulPage;
var _c;
__turbopack_context__.k.register(_c, "EditModulPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=app_6fca6c16._.js.map