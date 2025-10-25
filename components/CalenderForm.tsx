// components/CalendarForm.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import CalendarPicker from "@/components/CalenderPickerFilter";

interface CalendarFormProps {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  error?: string;
  label?: string;
  placeholder?: string;
}

export default function CalendarForm({
  selectedDate,
  onDateChange,
  error,
  label = "Tanggal",
  placeholder = "Pilih tanggal"
}: CalendarFormProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const date = new Date(value);
      onDateChange(date);
    } else {
      onDateChange(null);
    }
  };

  const getDateInputValue = () => {
    if (!selectedDate) return "";
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };

    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCalendarOpen]);

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-xl font-medium mb-2">
          {label}
        </label>
      )}
      <div className="flex gap-3">
        <div className="flex-1">
          <input
            type="date"
            value={getDateInputValue()}
            onChange={handleDateInputChange}
            placeholder={placeholder}
            className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
}