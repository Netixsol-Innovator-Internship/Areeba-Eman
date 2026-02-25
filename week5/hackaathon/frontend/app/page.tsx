"use client";
import { useState } from "react";
import {
  useGetCarsQuery,
  useCreateBidMutation,
} from "../features/api/apiSlice";
import CarCard from "../components/CarCard";
import CarCardSkeleton from "../components/Skeleton";

export default function LandingPage() {
  const [filters, setFilters] = useState({
    year: "",
    model: "",
    price: "",
    company: "",
  });
  const liveFilters = { ...filters, status: "live" };

  const { data: cars = [], isLoading, error } = useGetCarsQuery(liveFilters);
  const [submitBid] = useCreateBidMutation();

  const handleBid = async (carId: string) => {
    const amount = prompt("Enter your bid amount:");
    if (!amount) return;

    try {
      await submitBid({ carId, amount: Number(amount) }).unwrap();
      alert("Bid submitted!");
    } catch (err) {
      console.error(err);
      alert("Failed to submit bid");
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative h-[90vh] bg-cover bg-center flex items-center px-8"
        style={{ backgroundImage: "url('/landing-img.jpg')" }}
      >
        <div className="w-1/2 text-white z-10">
          <h1 className="text-4xl font-bold mb-3">Find your dream car</h1>
          <p className="text-lg">
            Browse and bid on the latest cars available in our live auction.
          </p>
        </div>

        {/* Filter Box */}
        <div className="absolute w-[60%] bottom-4 bg-white p-4 rounded shadow flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Year"
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
            className="border p-2 rounded flex-1 min-w-[80px]"
          />
          <input
            type="text"
            placeholder="Model"
            value={filters.model}
            onChange={(e) => setFilters({ ...filters, model: e.target.value })}
            className="border p-2 rounded flex-1 min-w-[100px]"
          />
          <input
            type="text"
            placeholder="Max Price"
            value={filters.price}
            onChange={(e) => setFilters({ ...filters, price: e.target.value })}
            className="border p-2 rounded flex-1 min-w-[100px]"
          />
          <select
            value={filters.company}
            onChange={(e) =>
              setFilters({ ...filters, company: e.target.value })
            }
            className="border p-2 rounded flex-1 min-w-[120px]"
          >
            <option value="">Company</option>
            <option value="Audi">Audi</option>
            <option value="Honda">Honda</option>
            <option value="BMW">BMW</option>
            <option value="Toyota">Toyota</option>
          </select>
        </div>
      </section>

      {/* Live Auction Section */}
      <section className="p-8 bg-blue-900 mt-10">
        <h2 className="text-3xl font-bold my-4 py-10 text-white">
          Live Auction
        </h2>

        {error && (
          <p className="text-red-500 mb-2">
            Failed to fetch cars.
          </p>
        )}

        {isLoading ? (
          <div className="flex flex-wrap gap-6">
            {[...Array(6)].map((_, index) => (
              <CarCardSkeleton key={index} />
            ))}
          </div>
        ) : cars.length === 0 ? (
          <p>No live cars found matching your filters.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} onBid={handleBid} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
