"use client";

import { useGetProfileQuery } from "../../features/api/apiSlice";
import TimeLeft from "../../components/TimeLeft";
import { usePathname, useRouter } from "next/navigation";

export default function WishlistPage() {
  const { data: profile, isLoading: profileLoading } = useGetProfileQuery();
  const pathname = usePathname();
  const router = useRouter();

  if (profileLoading) return <p>Loading wishlist...</p>;
  if (!profile) return <p>Profile not found</p>;
  if (!profile.wishlist || profile.wishlist.length === 0)
    return <p className="text-center mt-6">Your wishlist is empty</p>;

  return (
    <div>{/* Heading */}
        <div className="bg-blue-200 py-16 flex justify-center items-center mb-6">
          <h2 className="text-4xl font-bold text-blue-900">Wishlist</h2>
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
          className="py-2 px-4 text-left rounded border border-gray-300"
          onClick={() => router.push("/myBids")}
        >
          My Bids
        </button>
        <button
          className={`py-2 px-4 text-left rounded border border-gray-300 ${pathname === "/wishlist" ? "bg-blue-100" : ""}`}
          onClick={() => router.push("/wishlist")}
        >
          Wishlist
        </button>
      </div>

      {/* Right Content */}
      <div className="flex-1 p-6">
        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {profile.wishlist.map((car: any) => (
            <WishlistCarCard key={car._id} car={car} />
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}

// Car Card for Wishlist with navigation to createBids
function WishlistCarCard({ car }: { car: any }) {
  const router = useRouter();

  if (!car) return null;

  const totalBids = car.bids?.length ?? 0;
  const winningBid =
    car.bids && car.bids.length > 0 ? Math.max(...car.bids.map((b: any) => b.amount)) : car.currentBid;

  const auctionEndTime = new Date(car.createdAt).getTime() + 4 * 24 * 60 * 60 * 1000; // 4-day auction
  const isSoldOut = auctionEndTime < Date.now();

  const handleBid = () => {
    if (isSoldOut) return;
    router.push(`/createBids?id=${car._id}`);
  };

  return (
    <div className="bg-white rounded shadow overflow-hidden flex flex-col">
      <img
        src={car.photos?.length ? `http://localhost:4000${car.photos[0]}` : "/default-car.jpg"}
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
        onClick={handleBid}
        disabled={isSoldOut}
        className={`mt-auto w-full py-2 rounded text-white ${
          isSoldOut ? "bg-gray-400 cursor-not-allowed" : "bg-blue-900 hover:bg-blue-800"
        }`}
      >
        {isSoldOut ? "Sold Out" : "Submit a Bid"}
      </button>
    </div>
  );
}
