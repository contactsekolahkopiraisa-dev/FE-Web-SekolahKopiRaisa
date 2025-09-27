import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ActivityDetailSkeleton() {
  return (
    <div className="bg-secondary pt-20">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 md:mb-10">
          <div className="bg-tertiary p-6 rounded-xl shadow-md space-y-4">
            <Skeleton height={30} width="80%" />
            <Skeleton height={20} width="60%" />
            <Skeleton height={300} />
            <Skeleton count={8} />
          </div>
        </div>
        <div>
          <div className="bg-tertiary p-6 rounded-xl shadow-md space-y-4">
            <Skeleton height={24} width="40%" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton height={64} width={64} />
                  <div className="flex-1 space-y-2">
                    <Skeleton height={16} width="80%" />
                    <Skeleton height={14} width="60%" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
