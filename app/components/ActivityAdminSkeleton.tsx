"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ActivityAdminSkeleton() {
  return (
    <div className="bg-tertiary rounded-lg p-4 shadow-lg flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
      <div className="flex flex-col sm:flex-row sm:items-center">
        <div className="mb-2 sm:mb-0 sm:mr-4 flex-shrink-0">
          <Skeleton height={96} width={128} borderRadius={8} />
        </div>
        <div className="space-y-2">
          <Skeleton height={20} width={200} />
          <Skeleton height={14} width={120} />
        </div>
      </div>

      <div className="flex items-center space-x-2 self-end sm:self-auto">
        <Skeleton width={40} height={40} />
        <Skeleton width={40} height={40} />
      </div>
    </div>
  );
}
