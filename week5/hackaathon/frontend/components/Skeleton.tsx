"use client";

export default function CarCardSkeleton() {
  return (
    <div className="bg-white h-[400px] w-[400px] rounded shadow overflow-hidden animate-pulse relative">
      
      {/* Star (top right over image) */}
      <div className="absolute top-3 right-3 h-6 w-6 bg-gray-300 rounded-full z-10" />

      {/* Image */}
      <div className="h-48 w-full bg-gray-300" />

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        <div className="h-5 w-1/2 bg-gray-300 rounded" />
        <div className="h-4 w-2/3 bg-gray-300 rounded" />
        <div className="h-4 w-1/3 bg-gray-300 rounded" />
        <div className="h-4 w-3/4 bg-gray-300 rounded" />
        <div className="h-4 w-1/2 bg-gray-300 rounded" />
      </div>

      {/* Button */}
      <div className="h-12 w-full bg-gray-300" />
    </div>
  );
}