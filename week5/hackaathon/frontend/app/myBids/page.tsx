"use client";

import { useGetProfileQuery } from "../../features/api/apiSlice";
import TimeLeft from "../../components/TimeLeft";
import { usePathname, useRouter } from "next/navigation";

export default function MyBidsPage() {
  const { data: profile, isLoading: profileLoading } = useGetProfileQuery();
  const pathname = usePathname();
  const router = useRouter();

  if (profileLoading) return <p>Loading your bids...</p>;
  if (!profile) return <p>Profile not found</p>;
  if (!profile.myBids || profile.myBids.length === 0)
    return <p className="text-center mt-6">You have no bids</p>;

  return (
    <div>
        {/* Heading */}
        <div className="bg-blue-200 py-16 flex justify-center items-center mb-6">
          <h2 className="text-4xl font-bold text-blue-900">My Bids</h2>
        </div>
    <div className="min-h-screen flex">
        
      {/* Left Sidebar */}
      <div className="w-1/4 p-4 flex flex-col gap-2 text-blue-900">
        <button
          className={`py-2 px-4 text-left rounded border border-gray-300`}
          onClick={() => router.push("/myProfile")}
        >
          Personal Info
        </button>
        <button
          className="py-2 px-4 text-left rounded border border-gray-300"
          onClick={() => router.push("/myCars")}
        >
          My Cars
        </button>
        <button
          className={`py-2 px-4 text-left rounded border border-gray-300 ${
            pathname === "/myBids" ? "bg-blue-100" : ""
          }`}
          onClick={() => router.push("/myBids")}
        >
          My Bids
        </button>
        <button
          className="py-2 px-4 text-left rounded border border-gray-300"
          onClick={() => router.push("/wishlist")}
        >
          Wishlist
        </button>
      </div>

      {/* Right Content */}
      <div className="flex-1 p-6">
        {/* Bids Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {profile.myBids.map((bid: any) => (
            <CarBidCard key={bid._id} bid={bid} />
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}

// Car Card for Bids
function CarBidCard({ bid }: { bid: any }) {
  const car = bid.car;
  if (!car) return null;

  const totalBids = car.bids?.length ?? 0;
  const winningBid =
    car.bids && car.bids.length > 0
      ? Math.max(...car.bids.map((b: any) => b.amount))
      : car.currentBid;

  const auctionEndTime = new Date(car.createdAt).getTime() + 4 * 24 * 60 * 60 * 1000; // 4-day auction
  const isSoldOut = auctionEndTime < Date.now();

  return (
    <div className="bg-white rounded shadow overflow-hidden flex flex-col">
      <img
        src={car.photos?.length ? process.env.NEXT_PUBLIC_API_URL + car.photos[0] : "/default-car.jpg"}
        alt={car.model}
        className="h-48 w-full object-cover"
      />
      <div className="p-4 flex-1 flex flex-col gap-2">
        <h3 className="font-bold text-lg">{car.model}</h3>
        <p>Winning Bid: ${winningBid}</p>
        <p>Current Bid: ${car.currentBid}</p>
        <p>Total Bids: {totalBids}</p>
        <p>
          Time Left: <TimeLeft createdAt={car.createdAt} durationDays={4} />
        </p>
      </div>
      <button
        className="mt-auto w-full py-2 rounded text-white bg-gray-400"
      >
        Bid Submitted
      </button>
    </div>
  );
}
