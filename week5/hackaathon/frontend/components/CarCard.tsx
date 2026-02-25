"use client";
import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetProfileQuery,
  useGetCarsQuery,
} from "../features/api/apiSlice";
import TimeLeft from "./TimeLeft";
import { Car } from "../features/api/apiSlice";
import { useRouter } from "next/navigation";   // ⬅️ Import router

interface CarCardProps {
  car: Car;
  bidButton?: boolean;
  onBid?: (carId: string) => void;
}

export default function CarCard({ car, bidButton = true, onBid }: CarCardProps) {
  const [filters, setFilters] = useState({ status:"live" })
  const { data: cars = [], isLoading, error } = useGetCarsQuery(filters)

  const { data: profile, refetch: refetchProfile } = useGetProfileQuery();
  const [addWishlist] = useAddToWishlistMutation();
  const [removeWishlist] = useRemoveFromWishlistMutation();

  const [isWishlisted, setIsWishlisted] = useState(false);
  const router = useRouter();   // ⬅️ Initialize router

  useEffect(() => {
    if (!car?.id || !profile?.wishlist || !cars.length) return;

    const isLiveCar = cars.some(c => String(c.id) === String(car.id));
    if (!isLiveCar) {
      setIsWishlisted(false);
      return;
    }

    const isInWishlist = profile.wishlist.some(
      item => String((item as any)._id) === String(car.id)
    );

    setIsWishlisted(isInWishlist);
  }, [profile, car, cars]);

  const toggleWishlist = async () => {
    try {
      if (isWishlisted) {
        await removeWishlist(car.id).unwrap();
        setIsWishlisted(false);
      } else {
        await addWishlist(car.id).unwrap();
        setIsWishlisted(true);
      }
      refetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded shadow overflow-hidden flex flex-col relative">
      {/* Wishlist Star */}
      <div
        className="absolute top-2 right-2 cursor-pointer z-10 text-2xl"
        onClick={toggleWishlist}
      >
        <FaStar
          className={`transition-colors ${
            isWishlisted ? "text-yellow-400" : "text-gray-400"
          } hover:text-yellow-400`}
        />
      </div>

      <img src={car.image} alt={car.model} className="h-48 w-full object-cover" />

      <div className="p-4 flex-1 flex flex-col gap-2">
        <h3 className="font-bold text-lg">{car.model}</h3>
        <p>Make: {car.company}</p>
        <p>Year: {car.year}</p>
        <p>Current Bid: ${car.currentBid}</p>
        <p>
          Time Left: <TimeLeft createdAt={car.createdAt} durationDays={4} />
        </p>
      </div>

      {bidButton && (
        <button
          onClick={() => router.push(`/createBids?${car.id}`)}   // ⬅️ Navigate to createBid
          className="mt-auto w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Submit Bid
        </button>
      )}
    </div>
  );
}
