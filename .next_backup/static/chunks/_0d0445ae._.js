(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/_0d0445ae._.js", {

"[project]/lib/dummyUMKM.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "dummyUMKM": (()=>dummyUMKM)
});
const dummyUMKM = [
    {
        id: 1,
        namaUmkm: "Alfamart",
        ktp: 35362328300001,
        sertifikatHalal: "7868612",
        alamat: "Jalan Soekarno Hatta No. 123, Malang"
    },
    {
        id: 2,
        namaUmkm: "Indomaret",
        ktp: 35362328300001,
        sertifikatHalal: "7868612",
        alamat: "Jalan Soekarno Hatta No. 123, Malang"
    },
    {
        id: 3,
        namaUmkm: "Rasa Juang Coffee",
        ktp: 35362328300001,
        sertifikatHalal: "7868612",
        alamat: "Jalan Soekarno Hatta No. 123, Malang"
    },
    {
        id: 4,
        namaUmkm: "Risol Bakar Pak Kumis",
        ktp: 35362328300001,
        sertifikatHalal: "7868612",
        alamat: "Jalan Soekarno Hatta No. 123, Malang"
    },
    {
        id: 5,
        namaUmkm: "Kopi Kenangan",
        ktp: 35362328300001,
        sertifikatHalal: "7868612",
        alamat: "Jalan Soekarno Hatta No. 123, Malang"
    },
    {
        id: 6,
        namaUmkm: "Edamame Pak Eko",
        ktp: 35362328300001,
        sertifikatHalal: "7868612",
        alamat: "Jalan Soekarno Hatta No. 123, Malang"
    },
    {
        id: 7,
        namaUmkm: "Jaya Abadi",
        ktp: 35362328300001,
        sertifikatHalal: "7868612",
        alamat: "Jalan Soekarno Hatta No. 123, Malang"
    },
    {
        id: 8,
        namaUmkm: "Hebat Makmur",
        ktp: 35362328300001,
        sertifikatHalal: "7868612",
        alamat: "Jalan Soekarno Hatta No. 123, Malang"
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/admin/umkm/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>UmkmAdmin)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dummyUMKM$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dummyUMKM.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ConfirmModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ConfirmModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Popup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Popup.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function UmkmAdmin() {
    _s();
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dummyUMKM$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dummyUMKM"]);
    const [showConfirmModal, setShowConfirmModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showPopup, setShowPopup] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [popupType, setPopupType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("success");
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedId, setSelectedId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [actionType, setActionType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleApprove = (id)=>{
        setSelectedId(id);
        setActionType("approve");
        setShowConfirmModal(true);
    };
    const handleReject = (id)=>{
        setSelectedId(id);
        setActionType("reject");
        setShowConfirmModal(true);
    };
    const handleConfirm = async ()=>{
        if (!selectedId || !actionType) return;
        setIsSubmitting(true);
        try {
            // Simulasi API call dengan delay
            await new Promise((resolve)=>setTimeout(resolve, 1500));
            if (actionType === "approve") {
                console.log("Menyetujui UMKM dengan ID:", selectedId);
                // Update data dummy - hapus dari list setelah disetujui
                setData((prev)=>prev.filter((item)=>item.id !== selectedId));
                // Tutup modal konfirmasi
                setShowConfirmModal(false);
                // Tampilkan popup sukses
                setMessage("Berhasil Disetujui! UMKM berhasil disetujui dan ditambahkan ke daftar.");
                setPopupType("success");
                setShowPopup(true);
            } else if (actionType === "reject") {
                console.log("Menolak UMKM dengan ID:", selectedId);
                // Update data dummy - hapus dari list setelah ditolak
                setData((prev)=>prev.filter((item)=>item.id !== selectedId));
                // Tutup modal konfirmasi
                setShowConfirmModal(false);
                // Tampilkan popup sukses
                setMessage("UMKM Ditolak! UMKM telah ditolak dan dihapus dari daftar.");
                setPopupType("success");
                setShowPopup(true);
            }
            // Reset state
            setTimeout(()=>{
                setShowPopup(false);
                setSelectedId(null);
                setActionType(null);
                setIsSubmitting(false);
            }, 2000);
        } catch (error) {
            console.error("Error:", error);
            setShowConfirmModal(false);
            setMessage("Terjadi kesalahan saat memproses UMKM.");
            setPopupType("error");
            setShowPopup(true);
            setIsSubmitting(false);
        }
    };
    const getModalTitle = ()=>{
        if (actionType === "approve") return "Setujui UMKM";
        if (actionType === "reject") return "Tolak UMKM";
        return "";
    };
    const getModalDescription = ()=>{
        const umkmName = data.find((item)=>item.id === selectedId)?.namaUmkm;
        if (actionType === "approve") {
            return `Apakah Anda yakin ingin menyetujui UMKM "${umkmName}"? UMKM ini akan ditambahkan ke daftar yang disetujui.`;
        }
        if (actionType === "reject") {
            return `Apakah Anda yakin ingin menolak UMKM "${umkmName}"? UMKM ini akan dihapus dari daftar pengajuan.`;
        }
        return "";
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            showPopup && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Popup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                message: message,
                type: popupType,
                onClose: ()=>setShowPopup(false)
            }, void 0, false, {
                fileName: "[project]/app/admin/umkm/page.tsx",
                lineNumber: 106,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ConfirmModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                title: getModalTitle(),
                description: getModalDescription(),
                isOpen: showConfirmModal,
                isSubmitting: isSubmitting,
                onClose: ()=>{
                    setShowConfirmModal(false);
                    setSelectedId(null);
                    setActionType(null);
                },
                onConfirm: handleConfirm
            }, void 0, false, {
                fileName: "[project]/app/admin/umkm/page.tsx",
                lineNumber: 113,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white shadow-lg rounded-xl overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "overflow-x-auto",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                        className: "min-w-full divide-y divide-gray-200 text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                className: "bg-primary text-white",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap",
                                            children: "No"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/umkm/page.tsx",
                                            lineNumber: 132,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap",
                                            children: "Nama UMKM"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/umkm/page.tsx",
                                            lineNumber: 135,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap",
                                            children: "KTP"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/umkm/page.tsx",
                                            lineNumber: 138,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap",
                                            children: "Sertifikat Halal"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/umkm/page.tsx",
                                            lineNumber: 141,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap",
                                            children: "Alamat"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/umkm/page.tsx",
                                            lineNumber: 144,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/umkm/page.tsx",
                                            lineNumber: 147,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/admin/umkm/page.tsx",
                                    lineNumber: 131,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/admin/umkm/page.tsx",
                                lineNumber: 130,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                className: "text-gray-700 divide-y divide-gray-200",
                                children: data.length > 0 ? data.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        className: "hover:bg-gray-50",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-2 sm:px-4 py-3 whitespace-nowrap",
                                                children: index + 1
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/umkm/page.tsx",
                                                lineNumber: 156,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-2 sm:px-4 py-3 whitespace-nowrap",
                                                children: item.namaUmkm
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/umkm/page.tsx",
                                                lineNumber: 159,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-2 sm:px-4 py-3 whitespace-nowrap",
                                                children: item.ktp
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/umkm/page.tsx",
                                                lineNumber: 162,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-2 sm:px-4 py-3 whitespace-nowrap text-primary font-medium",
                                                children: item.sertifikatHalal
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/umkm/page.tsx",
                                                lineNumber: 165,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-2 sm:px-4 py-3 whitespace-nowrap text-primary font-medium",
                                                children: item.alamat
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/umkm/page.tsx",
                                                lineNumber: 168,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-2 sm:px-4 py-3 whitespace-nowrap",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex gap-2 justify-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleApprove(item.id),
                                                            disabled: isSubmitting,
                                                            className: "cursor-pointer p-2 text-white rounded-xl bg-primary hover:-translate-y-1 duration-150 ease-in disabled:opacity-50 disabled:cursor-not-allowed",
                                                            title: "Setuju",
                                                            children: "Setuju"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/umkm/page.tsx",
                                                            lineNumber: 173,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleReject(item.id),
                                                            disabled: isSubmitting,
                                                            className: "cursor-pointer p-2 text-white rounded-xl bg-red-600 hover:-translate-y-1 duration-150 ease-in disabled:opacity-50 disabled:cursor-not-allowed",
                                                            title: "Tolak",
                                                            children: "Tolak"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/umkm/page.tsx",
                                                            lineNumber: 181,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/umkm/page.tsx",
                                                    lineNumber: 172,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/umkm/page.tsx",
                                                lineNumber: 171,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, item.id, true, {
                                        fileName: "[project]/app/admin/umkm/page.tsx",
                                        lineNumber: 155,
                                        columnNumber: 21
                                    }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        colSpan: 6,
                                        className: "px-4 py-8 text-center text-gray-500",
                                        children: "Tidak ada data untuk periode yang dipilih"
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/umkm/page.tsx",
                                        lineNumber: 195,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/admin/umkm/page.tsx",
                                    lineNumber: 194,
                                    columnNumber: 21
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/admin/umkm/page.tsx",
                                lineNumber: 152,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/umkm/page.tsx",
                        lineNumber: 129,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/admin/umkm/page.tsx",
                    lineNumber: 128,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/admin/umkm/page.tsx",
                lineNumber: 127,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
_s(UmkmAdmin, "72F92zv615VAfb7NCM0/Fakcgl8=");
_c = UmkmAdmin;
var _c;
__turbopack_context__.k.register(_c, "UmkmAdmin");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=_0d0445ae._.js.map