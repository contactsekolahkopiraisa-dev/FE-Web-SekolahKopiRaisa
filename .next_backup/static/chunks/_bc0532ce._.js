(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/_bc0532ce._.js", {

"[project]/components/layanan/LayananHeader.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>LayananHeader)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function LayananHeader({ title = "Layanan", subtitle = "Layanan yang bisa diajukan di Sekolah Kopi Raisa" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "text-center pt-32 pb-12",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-5xl font-bold text-gray-900 mb-3",
                children: title
            }, void 0, false, {
                fileName: "[project]/components/layanan/LayananHeader.tsx",
                lineNumber: 12,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-gray-500 text-sm",
                children: subtitle
            }, void 0, false, {
                fileName: "[project]/components/layanan/LayananHeader.tsx",
                lineNumber: 15,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/layanan/LayananHeader.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_c = LayananHeader;
var _c;
__turbopack_context__.k.register(_c, "LayananHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/admin/layanan/ServiceForm.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>ServiceForm)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function ServiceForm({ initialData, targetPesertaOptions = [], onSubmit, onCancel, isLoading = false }) {
    _s();
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        nama: initialData?.nama || "",
        deskripsiLengkap: initialData?.deskripsiLengkap || "",
        deskripsiSingkat: initialData?.deskripsiSingkat || "",
        durasi: initialData?.durasi || "",
        targetPeserta: initialData?.targetPeserta || ""
    });
    const [imagePreview, setImagePreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialData?.image || null);
    const [selectedFile, setSelectedFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleInputChange = (e)=>{
        const { name, value } = e.target;
        setFormData((prev)=>({
                ...prev,
                [name]: value
            }));
    };
    const handleFileChange = (e)=>{
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = ()=>{
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleRemoveImage = ()=>{
        setImagePreview(null);
        setSelectedFile(null);
    };
    const handleSubmit = (e)=>{
        e.preventDefault();
        onSubmit(formData, selectedFile);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white rounded-xl shadow-sm p-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-2xl font-semibold text-gray-900 mb-8",
                children: "Informasi Dasar"
            }, void 0, false, {
                fileName: "[project]/components/admin/layanan/ServiceForm.tsx",
                lineNumber: 78,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                className: "space-y-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "nama",
                                className: "block text-sm font-medium text-gray-700 mb-2",
                                children: "Nama Layanan"
                            }, void 0, false, {
                                fileName: "[project]/components/admin/layanan/ServiceForm.tsx",
                                lineNumber: 85,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                id: "nama",
                                name: "nama",
                                value: formData.nama,
                                onChange: handleInputChange,
                                required: true,
                                className: "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition",
                                placeholder: "Masukkan nama layanan"
                            }, void 0, false, {
                                fileName: "[project]/components/admin/layanan/ServiceForm.tsx",
                                lineNumber: 91,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/admin/layanan/ServiceForm.tsx",
                        lineNumber: 84,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-medium text-gray-700 mb-2",
                                children: "Gambar Layanan"
                            }, void 0, false, {
                                fileName: "[project]/components/admin/layanan/ServiceForm.tsx",
                                lineNumber: 105,
                                columnNumber: 11
                            }, this),
                            imagePreview ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative w-full h-64 border-2 border-gray-200 rounded-lg overflow-hidden",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        src: imagePreview,
                                        alt: "Preview",
                                        fill: true,
                                        className: "object-cover"
                                    }, void 0, false, {
                                        fileName: "[project]/components/admin/layanan/ServiceForm.tsx",
                                        lineNumber: 111,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: handleRemoveImage,
                                        className: "absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            size: 16
                                        }, void 0, false, {
                                            fileName: "[project]/components/admin/layanan/ServiceForm.tsx",
                                            lineNumber: 122,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/admin/layanan/ServiceForm.tsx",
                                        lineNumber: 117,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/admin/layanan/ServiceForm.tsx",
                                lineNumber: 110,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "file-upload",
                                className: "flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col items-center justify-center py-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                                className: "w-10 h-10 text-gray-400 mb-2"
                                            }, void 0, false, {
                                                fileName: "[project]/components/admin/layanan/ServiceForm.tsx",
                                                lineNumber: 131,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-500 font-medium",
                                                children: "Unggah File"
                                            }, void 0, false, {
                                                fileName: "[project]/components/admin/layanan/ServiceForm.tsx",
                                                lineNumber: 132,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-400 mt-1",
                                                children: "PNG, JPG hingga 5MB"
                                            }, void 0, false, {
                                                fileName: "[project]/components/admin/layanan/ServiceForm.tsx",
                                                lineNumber: 133,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/admin/layanan/ServiceForm.tsx",
                                        lineNumber: 130,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: "file-upload",
                                        type: "file",
                                        className: "hidden",
                                        accept: "image/*",
                                        onChange: handleFileChange
                                    }, void 0, false, {
                                        fileName: "[project]/components/admin/layanan/ServiceForm.tsx",
                                        lineNumber: 137,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/admin/layanan/ServiceForm.tsx",
                                lineNumber: 126,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/admin/layanan/ServiceForm.tsx",
                        lineNumber: 104,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "deskripsiLengkap",
                                className: "block text-sm font-medium text-gray-700 mb-2",
                                children: "Deskripsi Lengkap"
                            }, void 0, false, {
                                fileName: "[project]/components/admin/layanan/ServiceForm.tsx",
                                lineNumber: 150,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                id: "deskripsiLengkap",
                                name: "deskripsiLengkap",
                                value: formData.deskripsiLengkap,
                                onChange: handleInputChange,
                                required: true,
                                rows: 4,
                                className: "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition resize-none",
                                placeholder: "Deskripsi yang akan muncul di detail layanan"
                            }, void 0, false, {
                                fileName: "[project]/components/admin/layanan/ServiceForm.tsx",
                                lineNumber: 156,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/admin/layanan/ServiceForm.tsx",
                        lineNumber: 149,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "deskripsiSingkat",
                                className: "block text-sm font-medium text-gray-700 mb-2",
                                children: "Deskripsi Singkat"
                            }, void 0, false, {
                                fileName: "[project]/components/admin/layanan/ServiceForm.tsx",
                                lineNumber: 170,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                id: "deskripsiSingkat",
                                name: "deskripsiSingkat",
                                value: formData.deskripsiSingkat,
                                onChange: handleInputChange,
                                required: true,
                                className: "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition",
                                placeholder: "Deskripsi yang muncul di card"
                            }, void 0, false, {
                                fileName: "[project]/components/admin/layanan/ServiceForm.tsx",
                                lineNumber: 176,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/admin/layanan/ServiceForm.tsx",
                        lineNumber: 169,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "durasi",
                                className: "block text-sm font-medium text-gray-700 mb-2",
                                children: "Durasi"
                            }, void 0, false, {
                                fileName: "[project]/components/admin/layanan/ServiceForm.tsx",
                                lineNumber: 190,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                id: "durasi",
                                name: "durasi",
                                value: formData.durasi,
                                onChange: handleInputChange,
                                required: true,
                                className: "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition",
                                placeholder: "Contoh : 1 hari, 2-4 bulan"
                            }, void 0, false, {
                                fileName: "[project]/components/admin/layanan/ServiceForm.tsx",
                                lineNumber: 196,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/admin/layanan/ServiceForm.tsx",
                        lineNumber: 189,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "targetPeserta",
                                className: "block text-sm font-medium text-gray-700 mb-2",
                                children: "Target Peserta"
                            }, void 0, false, {
                                fileName: "[project]/components/admin/layanan/ServiceForm.tsx",
                                lineNumber: 210,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        id: "targetPeserta",
                                        name: "targetPeserta",
                                        value: formData.targetPeserta,
                                        onChange: handleInputChange,
                                        required: true,
                                        className: "w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition appearance-none bg-white text-gray-900 cursor-pointer",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                className: "text-gray-500",
                                                children: "Pilih Target Peserta"
                                            }, void 0, false, {
                                                fileName: "[project]/components/admin/layanan/ServiceForm.tsx",
                                                lineNumber: 225,
                                                columnNumber: 15
                                            }, this),
                                            targetPesertaOptions.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: option.id,
                                                    className: "text-gray-900",
                                                    children: option.nama_target
                                                }, option.id, false, {
                                                    fileName: "[project]/components/admin/layanan/ServiceForm.tsx",
                                                    lineNumber: 229,
                                                    columnNumber: 17
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/admin/layanan/ServiceForm.tsx",
                                        lineNumber: 217,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                        className: "absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                                    }, void 0, false, {
                                        fileName: "[project]/components/admin/layanan/ServiceForm.tsx",
                                        lineNumber: 238,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/admin/layanan/ServiceForm.tsx",
                                lineNumber: 216,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/admin/layanan/ServiceForm.tsx",
                        lineNumber: 209,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-4 pt-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                disabled: isLoading,
                                className: "px-8 py-2.5 bg-amber-900 text-white rounded-lg hover:bg-amber-950 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed",
                                children: isLoading ? "Menyimpan..." : "Simpan Perubahan"
                            }, void 0, false, {
                                fileName: "[project]/components/admin/layanan/ServiceForm.tsx",
                                lineNumber: 244,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: onCancel,
                                disabled: isLoading,
                                className: "px-8 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed",
                                children: "Kembali"
                            }, void 0, false, {
                                fileName: "[project]/components/admin/layanan/ServiceForm.tsx",
                                lineNumber: 251,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/admin/layanan/ServiceForm.tsx",
                        lineNumber: 243,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/admin/layanan/ServiceForm.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/admin/layanan/ServiceForm.tsx",
        lineNumber: 77,
        columnNumber: 5
    }, this);
}
_s(ServiceForm, "6foyEeOCIY5e8jkWUKP3ucCjFWo=");
_c = ServiceForm;
var _c;
__turbopack_context__.k.register(_c, "ServiceForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/utils/jenisLayanan.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "fetchAllJenisLayanan": (()=>fetchAllJenisLayanan),
    "fetchAllTargetPeserta": (()=>fetchAllTargetPeserta),
    "fetchJenisLayananById": (()=>fetchJenisLayananById),
    "fetchTargetPesertaById": (()=>fetchTargetPesertaById),
    "updateJenisLayanan": (()=>updateJenisLayanan)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/api.ts [app-client] (ecmascript)");
;
const fetchAllJenisLayanan = async ()=>{
    try {
        console.log("Fetching jenis layanan from API...");
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/api/v1/jenis-layanan");
        console.log("Jenis layanan response:", response);
        console.log("Jenis layanan data:", JSON.stringify(response.data.data, null, 2));
        return response.data.data;
    } catch (error) {
        console.error("Error fetching jenis layanan:", error);
        console.error("Error response:", error.response);
        throw new Error(error.response?.data?.message || "Gagal mengambil data jenis layanan");
    }
};
const fetchJenisLayananById = async (id)=>{
    try {
        console.log(`Fetching jenis layanan by id: ${id}`);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/api/v1/jenis-layanan/${id}`);
        console.log("Jenis layanan detail:", response.data);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching jenis layanan by id:", error);
        throw new Error(error.response?.data?.message || "Gagal mengambil detail jenis layanan");
    }
};
const updateJenisLayanan = async (id, formData)=>{
    try {
        const data = new FormData();
        data.append("nama_jenis_layanan", formData.nama);
        data.append("deskripsi_singkat", formData.deskripsi_singkat);
        data.append("deskripsi_lengkap", formData.deskripsi_lengkap);
        if (formData.durasi) {
            data.append("estimasi_waktu", formData.durasi);
        }
        data.append("id_target_peserta", formData.id_target_peserta.toString());
        if (formData.image) {
            data.append("image", formData.image);
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/api/v1/jenis-layanan/${id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data.data;
    } catch (error) {
        console.error("Error updating jenis layanan:", error);
        throw new Error(error.response?.data?.message || "Gagal memperbarui jenis layanan");
    }
};
const fetchAllTargetPeserta = async ()=>{
    try {
        console.log("Fetching target peserta from API...");
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/api/v1/target-peserta");
        console.log("Target peserta response:", response);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching target peserta:", error);
        throw new Error(error.response?.data?.message || "Gagal mengambil data target peserta");
    }
};
const fetchTargetPesertaById = async (id)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/api/v1/target-peserta/${id}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching target peserta by id:", error);
        throw new Error(error.response?.data?.message || "Gagal mengambil detail target peserta");
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/admin/layanan/daftar-layanan/[slug]/edit/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>EditLayananPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layanan$2f$LayananHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layanan/LayananHeader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$admin$2f$layanan$2f$ServiceForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/admin/layanan/ServiceForm.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$jenisLayanan$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/jenisLayanan.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
// Move titleBySlug outside component to avoid re-creation
// IMPORTANT: These must match EXACTLY with nama_jenis_layanan from backend
const titleBySlug = {
    kunjungan: "Kunjungan test",
    magang: "Magang gile anjay",
    pelatihan: "Pelatihan",
    "undangan-narasumber": "Undangan Narasumber",
    pkl: "Praktek Kerja Lapangan (PKL)"
};
function EditLayananPage() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const slug = params?.slug || "";
    const [jenisLayanan, setJenisLayanan] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [targetPesertaList, setTargetPesertaList] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const loadData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "EditLayananPage.useCallback[loadData]": async ()=>{
            try {
                setIsLoading(true);
                if (!slug) {
                    console.warn("Slug is empty, skipping load");
                    setIsLoading(false);
                    return;
                }
                console.log("=== START LOADING DATA ===");
                console.log("1. Slug received:", slug);
                console.log("2. Slug type:", typeof slug);
                // Fetch all jenis layanan
                const allLayanan = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$jenisLayanan$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchAllJenisLayanan"])();
                console.log("3. All layanan fetched:", allLayanan);
                console.log("4. Total layanan:", allLayanan.length);
                // Find the one matching the slug
                const targetName = titleBySlug[slug];
                console.log("5. Target name from titleBySlug:", targetName);
                console.log("6. titleBySlug object:", titleBySlug);
                // Log all service names for comparison
                console.log("7. All service names:");
                allLayanan.forEach({
                    "EditLayananPage.useCallback[loadData]": (l, idx)=>{
                        console.log(`   ${idx}. "${l.nama_jenis_layanan}" (lowercase: "${l.nama_jenis_layanan.toLowerCase()}")`);
                    }
                }["EditLayananPage.useCallback[loadData]"]);
                if (targetName) {
                    console.log("8. Looking for:", targetName.toLowerCase());
                } else {
                    console.warn("8. WARNING: targetName is undefined/null for slug:", slug);
                }
                const foundLayanan = allLayanan.find({
                    "EditLayananPage.useCallback[loadData].foundLayanan": (l)=>l.nama_jenis_layanan.toLowerCase() === targetName?.toLowerCase()
                }["EditLayananPage.useCallback[loadData].foundLayanan"]);
                console.log("9. Found layanan:", foundLayanan);
                if (!foundLayanan) {
                    console.error("10. ERROR: Layanan not found!");
                    console.error("    - Slug:", slug);
                    console.error("    - Target name:", targetName);
                    console.error("    - Available names:", allLayanan.map({
                        "EditLayananPage.useCallback[loadData]": (l)=>l.nama_jenis_layanan
                    }["EditLayananPage.useCallback[loadData]"]));
                    throw new Error("Layanan tidak ditemukan");
                }
                console.log("11. SUCCESS: Found layanan:", foundLayanan);
                setJenisLayanan(foundLayanan);
                // Fetch target peserta options
                const targetPeserta = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$jenisLayanan$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchAllTargetPeserta"])();
                console.log("12. Target peserta fetched:", targetPeserta);
                setTargetPesertaList(targetPeserta);
                console.log("=== END LOADING DATA (SUCCESS) ===");
            } catch (error) {
                console.error("=== ERROR IN LOADING DATA ===");
                console.error("Error:", error);
                console.error("Error message:", error.message);
                const Swal = (await __turbopack_context__.r("[project]/node_modules/sweetalert2/dist/sweetalert2.all.js [app-client] (ecmascript, async loader)")(__turbopack_context__.i)).default;
                await Swal.fire({
                    icon: "error",
                    title: "Gagal Memuat Data",
                    text: error.message || "Terjadi kesalahan saat memuat data",
                    confirmButtonColor: "#4E342E",
                    customClass: {
                        popup: "rounded-xl"
                    }
                });
                router.push("/admin/layanan/daftar-layanan");
            } finally{
                setIsLoading(false);
            }
        }
    }["EditLayananPage.useCallback[loadData]"], [
        slug,
        router
    ]); // Remove titleBySlug from dependencies
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EditLayananPage.useEffect": ()=>{
            console.log("useEffect triggered, slug:", slug);
            if (slug) {
                loadData();
            } else {
                console.warn("Slug is empty in useEffect");
                setIsLoading(false);
            }
        }
    }["EditLayananPage.useEffect"], [
        slug,
        loadData
    ]);
    const initialData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "EditLayananPage.useMemo[initialData]": ()=>{
            if (!jenisLayanan) {
                return {
                    nama: "",
                    deskripsiLengkap: "",
                    deskripsiSingkat: "",
                    durasi: "",
                    targetPeserta: "",
                    image: ""
                };
            }
            return {
                nama: jenisLayanan.nama_jenis_layanan,
                deskripsiLengkap: jenisLayanan.deskripsi_lengkap,
                deskripsiSingkat: jenisLayanan.deskripsi_singkat,
                durasi: jenisLayanan.estimasi_waktu || "",
                targetPeserta: jenisLayanan.id_target_peserta.toString(),
                image: jenisLayanan.image
            };
        }
    }["EditLayananPage.useMemo[initialData]"], [
        jenisLayanan
    ]);
    const handleSubmit = async (data, file)=>{
        if (!jenisLayanan) return;
        try {
            setIsSubmitting(true);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$jenisLayanan$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateJenisLayanan"])(jenisLayanan.id, {
                nama: data.nama,
                deskripsi_lengkap: data.deskripsiLengkap,
                deskripsi_singkat: data.deskripsiSingkat,
                durasi: data.durasi,
                id_target_peserta: parseInt(data.targetPeserta),
                image: file || undefined
            });
            const Swal = (await __turbopack_context__.r("[project]/node_modules/sweetalert2/dist/sweetalert2.all.js [app-client] (ecmascript, async loader)")(__turbopack_context__.i)).default;
            await Swal.fire({
                icon: "success",
                title: "Layanan Berhasil Diperbarui",
                confirmButtonColor: "#4E342E",
                customClass: {
                    popup: "rounded-xl"
                }
            });
            router.push("/admin/layanan/daftar-layanan");
        } catch (error) {
            const Swal = (await __turbopack_context__.r("[project]/node_modules/sweetalert2/dist/sweetalert2.all.js [app-client] (ecmascript, async loader)")(__turbopack_context__.i)).default;
            await Swal.fire({
                icon: "error",
                title: "Gagal Memperbarui Layanan",
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
            className: "min-h-screen flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-gray-600",
                children: "Memuat data..."
            }, void 0, false, {
                fileName: "[project]/app/admin/layanan/daftar-layanan/[slug]/edit/page.tsx",
                lineNumber: 204,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/admin/layanan/daftar-layanan/[slug]/edit/page.tsx",
            lineNumber: 203,
            columnNumber: 7
        }, this);
    }
    if (!jenisLayanan) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-gray-600",
                children: "Data layanan tidak ditemukan"
            }, void 0, false, {
                fileName: "[project]/app/admin/layanan/daftar-layanan/[slug]/edit/page.tsx",
                lineNumber: 212,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/admin/layanan/daftar-layanan/[slug]/edit/page.tsx",
            lineNumber: 211,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layanan$2f$LayananHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                title: "Edit Layanan",
                subtitle: titleBySlug[slug] || ""
            }, void 0, false, {
                fileName: "[project]/app/admin/layanan/daftar-layanan/[slug]/edit/page.tsx",
                lineNumber: 219,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "py-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container mx-auto px-4 max-w-4xl",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$admin$2f$layanan$2f$ServiceForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        initialData: initialData,
                        targetPesertaOptions: targetPesertaList,
                        onSubmit: handleSubmit,
                        onCancel: handleCancel,
                        isLoading: isSubmitting
                    }, void 0, false, {
                        fileName: "[project]/app/admin/layanan/daftar-layanan/[slug]/edit/page.tsx",
                        lineNumber: 222,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/admin/layanan/daftar-layanan/[slug]/edit/page.tsx",
                    lineNumber: 221,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/admin/layanan/daftar-layanan/[slug]/edit/page.tsx",
                lineNumber: 220,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/admin/layanan/daftar-layanan/[slug]/edit/page.tsx",
        lineNumber: 218,
        columnNumber: 5
    }, this);
}
_s(EditLayananPage, "PzFSq5Mn+kN8M01yYfsEQHdsnfo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = EditLayananPage;
var _c;
__turbopack_context__.k.register(_c, "EditLayananPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/**
 * @license lucide-react v0.485.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s({
    "__iconNode": (()=>__iconNode),
    "default": (()=>Upload)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
            key: "ih7n3h"
        }
    ],
    [
        "polyline",
        {
            points: "17 8 12 3 7 8",
            key: "t8dd8p"
        }
    ],
    [
        "line",
        {
            x1: "12",
            x2: "12",
            y1: "3",
            y2: "15",
            key: "widbto"
        }
    ]
];
const Upload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("upload", __iconNode);
;
 //# sourceMappingURL=upload.js.map
}}),
"[project]/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript) <export default as Upload>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "Upload": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript)");
}}),
}]);

//# sourceMappingURL=_bc0532ce._.js.map