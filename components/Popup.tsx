"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCheck, TriangleAlert, X } from "lucide-react";

interface PopupProps {
  message: string;
  onClose: () => void;
  duration?: number; // dalam ms
  type?: "success" | "error";
}

export default function Popup({
  message,
  onClose,
  duration = 10000,
  type = "success",
}: PopupProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = type === "error" ? "bg-gradient-to-r from-red-500 to-red-600" : "bg-gradient-to-r from-green-500 to-green-600";

  const Icon = type === "error" ? <TriangleAlert size={20} /> : <CheckCheck size={20} />;

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className={`fixed z-50 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg 
            max-w-[90vw] md:max-w-fit w-full 
            top-6 left-1/2 -translate-x-1/2 
            md:top-6 md:right-6 md:left-auto md:translate-x-0`}
        >
          <div className="flex items-center gap-3">
            <span>{Icon}</span>
            <span className="flex-1 text-sm break-words">
              {message}
            </span>
            <button onClick={onClose} className="ml-2 cursor-pointer">
              <X size={20} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}