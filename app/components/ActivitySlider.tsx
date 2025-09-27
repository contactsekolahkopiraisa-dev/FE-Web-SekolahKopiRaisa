"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ActivitySliderProps {
  id: number;
  image: string;
  title: string;
}

export default function ActivitySlider({
  sliderItems,
}: {
  sliderItems: ActivitySliderProps[];
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliderItems.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [sliderItems.length]);

  return (
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-xl shadow-lg">
      <AnimatePresence mode="wait">
        <motion.div
          key={sliderItems[current].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Image
            src={sliderItems[current].image}
            alt={sliderItems[current].title}
            fill
            className="object-cover rounded-xl"
            priority={current === 0} // Prioritizing the first image
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-6 py-8 rounded-b-xl">
            <h2 className="text-white text-lg font-medium max-w-3xl leading-snug">
              {sliderItems[current].title}
            </h2>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {sliderItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === current ? "bg-white scale-110" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
