"use client";

import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ActivityUserSkeleton() {
  return (
    <div className="px-4 md:px-8 py-4 max-w-400 mx-auto">
      {/* Skeleton untuk ActivitySlider */}
      <section className="mt-20 md:mt-30">
        <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-md">
          <Skeleton height="100%" width="100%" borderRadius="0.75rem" />

          {/* Placeholder untuk dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {[...Array(5)].map((_, index) => (
              <Skeleton
                key={index}
                width={12}
                height={12}
                circle
                baseColor="#d1d5db" // Tailwind gray-300
                highlightColor="#e5e7eb" // Tailwind gray-200
              />
            ))}
          </div>
        </div>
      </section>

      {/* Skeleton untuk ActivityCard */}
      <section className="mt-8 bg-white p-6 rounded-xl shadow-md">
        <div className="mb-4">
          <Skeleton width="25%" height={24} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, index) => (
            <div key={index}>
              <Skeleton height={160} borderRadius={12} className="mb-2" />
              <Skeleton width="75%" height={16} />
              <Skeleton width="25%" height={14} style={{ marginTop: "0.25rem" }} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
