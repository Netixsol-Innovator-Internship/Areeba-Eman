"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import {
  useGetCarsQuery,
  useSubmitBidMutation,
  useGetProfileQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "../../features/api/apiSlice";
import TimeLeft from "../../components/TimeLeft";
import CarCardSkeleton from "../../components/Skeleton";

export default function CarAuctionPage() {
  const [filters, setFilters] = useState({
    year: "",
    model: "",
    price: "",
    company: "",
  });
  const router = useRouter();
  const { data: cars = [], isLoading, error } = useGetCarsQuery(filters);

  // Wishlist hooks
  const { data: profile, refetch: refetchProfile } = useGetProfileQuery();
  const [addWishlist] = useAddToWishlistMutation();
  const [removeWishlist] = useRemoveFromWishlistMutation();

  const [submitBid] = useSubmitBidMutation();

  const goToCreateBid = (carId: string) => {
    router.push(`/createBids?${carId}`);
  };

  // Check if car is in wishlist
  const isCarWishlisted = (carId: string) => {
    return profile?.wishlist?.some(
      (item: any) => String(item._id) === String(carId),
    );
  };

  // Toggle wishlist
  const toggleWishlist = async (carId: string) => {
    try {
      if (isCarWishlisted(carId)) {
        await removeWishlist(carId).unwrap();
      } else {
        await addWishlist(carId).unwrap();
      }
      await refetchProfile(); // keep profile in sync
    } catch (err) {
      console.error("Failed to toggle wishlist:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Heading Section */}
      <div className="bg-blue-200 py-16 flex justify-center items-center">
        <h2 className="text-4xl font-bold text-blue-900">Auction</h2>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row flex-1 py-8 px-20 gap-6">
        {/* Left side: car list */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Showing total results */}
          <p className="text-gray-700 mb-4">
            Showing <span className="font-bold">{cars.length}</span> results
          </p>

          {error && <p className="text-red-500 mb-2">Failed to fetch cars.</p>}
          {isLoading ? (
            <div className="flex flex-col gap-6">
              {[...Array(6)].map((_, index) => (
                <CarCardSkeleton key={index} />
              ))}
            </div>
          ) : cars.length === 0 ? (
            <p>No cars found.</p>
          ) : (
            cars.map((car) => (
              <div
                key={car.id}
                className="bg-white shadow-md rounded-lg flex flex-col lg:flex-row items-center p-4 gap-4 w-full relative"
              >
                {/* Wishlist Star */}
                <div
                  className="absolute top-2 right-2 cursor-pointer text-2xl"
                  onClick={() => toggleWishlist(car.id)}
                >
                  <FaStar
                    className={`transition-colors ${
                      isCarWishlisted(car.id)
                        ? "text-yellow-400"
                        : "text-gray-400"
                    } hover:text-yellow-400`}
                  />
                </div>

                {/* Left: Car Image */}
                <div className="flex-shrink-0 w-full lg:w-48">
                  <img
                    src={car.image}
                    alt={car.model}
                    className="h-40 w-full object-cover rounded"
                  />
                </div>

                {/* Middle: Car Details */}
                <div className="flex-1 px-2">
                  <h3 className="font-bold text-xl">{car.model}</h3>
                  <p className="text-gray-600">Make: {car.company}</p>
                  <p className="text-gray-600">Year: {car.year}</p>
                  <p className="text-gray-600">
                    Mileage: {car.mileage || "N/A"}
                  </p>
                  <p className="text-gray-600">Paint: {car.paint}</p>
                </div>

                {/* Right: Bid info */}
                <div className="flex flex-col items-end gap-2">
                  <p className="text-gray-700">
                    Time Left: <TimeLeft createdAt={car.createdAt} />
                  </p>
                  <p className="font-bold text-lg">
                    Current Bid: ${car.currentBid}
                  </p>
                  <button
                    onClick={() => goToCreateBid(car.id)}
                    className={`mt-2 px-8 py-2 rounded ${
                      car.status === "live"
                        ? "bg-blue-900 text-white hover:bg-blue-800"
                        : "bg-white border border-blue-900 text-blue-800 hover:bg-blue-100"
                    }`}
                  >
                    Submit Bid
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right side: Filters */}
        <div className="w-full lg:w-64 bg-white p-4 rounded shadow flex-shrink-0">
          <h3 className="font-bold text-lg mb-4">Filters</h3>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Year"
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Model"
              value={filters.model}
              onChange={(e) =>
                setFilters({ ...filters, model: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Max Price"
              value={filters.price}
              onChange={(e) =>
                setFilters({ ...filters, price: e.target.value })
              }
              className="border p-2 rounded"
            />
            <select
              value={filters.company}
              onChange={(e) =>
                setFilters({ ...filters, company: e.target.value })
              }
              className="border p-2 rounded"
            >
              <option value="">Company</option>
              <option value="Audi">Audi</option>
              <option value="Honda">Honda</option>
              <option value="BMW">BMW</option>
              <option value="Toyota">Toyota</option>
            </select>
            <button
              onClick={() => {}}
              className="mt-2 w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-800"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
