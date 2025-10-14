"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";


export default function CalendarPicker({ selectedDate, onSelectDate, onClose }: any) {
  const [currentYear, setCurrentYear] = useState(selectedDate?.getFullYear() || new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(selectedDate?.getMonth() ?? new Date().getMonth());
  const [view, setView] = useState<'month' | 'year'>('month');

  const bulanNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(currentYear, monthIndex);
    onSelectDate(newDate);
    onClose();
  };

  const handleYearSelect = (year: number) => {
    setCurrentYear(year);
    setView('month');
  };

  const startYear = 2020;
  const endYear = 2030;
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

  return (
    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-xl z-50 p-4 w-80">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => view === 'month' ? setView('year') : null}
          className="text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          {view === 'month' ? `${bulanNames[currentMonth]} ${currentYear}` : 'Pilih Tahun'}
        </button>
        {view === 'month' && (
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (currentMonth === 0) {
                  setCurrentMonth(11);
                  setCurrentYear(currentYear - 1);
                } else {
                  setCurrentMonth(currentMonth - 1);
                }
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => {
                if (currentMonth === 11) {
                  setCurrentMonth(0);
                  setCurrentYear(currentYear + 1);
                } else {
                  setCurrentMonth(currentMonth + 1);
                }
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {view === 'month' ? (
        <div className="grid grid-cols-3 gap-2">
          {bulanNames.map((bulan, index) => (
            <button
              key={bulan}
              onClick={() => handleMonthSelect(index)}
              className={`py-3 px-2 text-sm rounded-lg hover:bg-secondary hover:text-primary transition-colors ${
                selectedDate?.getMonth() === index && selectedDate?.getFullYear() === currentYear
                  ? 'bg-secondary text-primary hover:bg-primary hover:text-secondary'
                  : 'bg-gray-50 text-gray-700'
              }`}
            >
              {bulan}
            </button>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => handleYearSelect(year)}
              className={`py-3 px-2 text-sm rounded-lg hover:bg-blue-50 transition-colors ${
                currentYear === year
                  ? 'bg-secondary text-primary hover:bg-primary hover:text-secondary'
                  : 'bg-gray-50 text-gray-700'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
        <button
          onClick={() => {
            onSelectDate(null);
            onClose();
          }}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          Reset
        </button>
        <button
          onClick={onClose}
          className="text-sm text-primary hover:text-primary/70 font-medium"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
