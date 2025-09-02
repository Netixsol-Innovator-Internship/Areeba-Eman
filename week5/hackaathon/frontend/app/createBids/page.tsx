"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCreateBidMutation, useGetCarByIdQuery, useGetBidsQuery } from "../../features/api/apiSlice";
import TimeLeft from "../../components/TimeLeft";

interface Car {
  id: string;
  model: string;
  make: string;
  year: number;
  paint: string;
  mileage?: number;
  photos: string[];
  maxBid: number;
  currentBid: number;
  createdAt: string;
}
type Bid = {
  amount: number;
   bidder: {        // note: bidder, not user
    fullName: string;
    username?: string;
  };
};

export default function CreateBidsPage() {
  const searchParams = useSearchParams();
  const carId = searchParams.get("carId");

  const { data: car, isLoading: carLoading, error: carError } = useGetCarByIdQuery(carId || "", { skip: !carId });
  const { data: bids = [], refetch } = useGetBidsQuery(carId || "", { skip: !carId });

  const [bidAmount, setBidAmount] = useState<number>(0);
  const [createBid] = useCreateBidMutation();
  const topBidder = bids[0]?.user ?? { fullName: '', email: '', phone: '', nationality: '', city: '' }

  // Initialize bidAmount when car data is loaded
  useEffect(() => {
    if (car) {
      setBidAmount(car.currentBid + 100); // set default bid 100 more than current
    }
  }, [car]);

  if (!carId) return <p>Loading car ID...</p>;
  if (carLoading) return <p>Loading car details...</p>;
  if (!car) return <p>Car not found</p>;

  const handleSubmitBid = async () => {
    if (!bidAmount || bidAmount <= car.currentBid) {
      alert("Bid must be higher than current bid");
      return;
    }
    try {
      await createBid({ carId, amount: bidAmount }).unwrap();
      alert("Bid submitted!");
      refetch();
    } catch (err) {
      console.error(err);
      alert("Failed to submit bid");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-blue-200 py-16 flex justify-center items-center">
        <h2 className="text-4xl font-bold text-blue-900">{car.model}</h2>
      </div>

      {/* Dark blue center div */}
      <div className="bg-blue-900 text-white text-center py-6">
        <h3 className="text-2xl font-bold">{car.model}</h3>
      </div>

      {/* Images Section */}
    <div className="flex gap-2 my-6 px-20">
        {/* Main large image */}
        <div className="flex-1">
            <img
            src={car.photos[0] ? `http://localhost:4000${car.photos[0]}` : "/default-car.jpg"}
            alt={car.model}
            className="w-full h-120 object-cover rounded"
            />
    </div>

        {/* Smaller images */}
        <div className="flex flex-col gap-2 w-1/5">
            {car.photos.slice(1).map((photo: string, i: number) => (
            <img
                key={i}
                src={`http://localhost:4000${photo}`} // prepend backend URL
                alt={`car-${i}`}
                className="w-full h-40 object-cover rounded"
            />
            ))}
        </div>
    </div>


      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 px-20 mb-10">
        {/* Left */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-blue-100 flex justify-between p-4 rounded">
            <p>Time Left: <TimeLeft createdAt={car.createdAt} /></p>
            <p>Current Bid: ${car.currentBid}</p>
            <p>Min Increment: $100</p>
            <p>Total Bids: {bids.length}</p>
            <p>Color: {car.paint}</p>
          </div>

          <div className="p-4 bg-white rounded shadow">
            <p>
              Lorem ipsum dolor sit amet consectetur. Duis ac sodales vulputate dolor volutpat ac.
              Turpis ut neque eu adipiscing nibh nunc gravida. Ipsum at feugiat id dui elementum
              nibh nec suspendisse. Ut sapien metus elementum tincidunt euismod. In est eget turpis
              nulla leo amet arcu. Consequat viverra erat pellentesque ut non placerat placerat amet
              vitae. Lobortis velit senectus blandit pellentesque viverra augue dolor orci. Odio
              leo in et in. Ac purus morbi ac vulputate amet. Ut maecenas leo venenatis aliquet a
              fringilla quam varius pellentesque.
            </p>
          </div>

          {bids.length > 0 && (
            <div className="py-4  bg-white rounded shadow mt-4">
                <h3 className="font-bold mb-2 bg-blue-900 text-white p-2">Top Bidder</h3>
                <p>Full Name: {bids[0].bidder.fullName}</p>
                <p>Username: {bids[0].bidder.username}</p>
                <p>Amount: ${bids[0].amount}</p>
            </div>
            )}
        </div>

        {/* Right */}
        <div className="w-full lg:w-1/3 bg-white p-4 rounded shadow flex flex-col gap-4">
          <h3 className="font-bold text-lg mb-2">Place Your Bid</h3>

          <input
            type="number"
            value={bidAmount}
            min={car.currentBid + 100}
            max={car.maxBid}
            onChange={(e) => setBidAmount(Number(e.target.value))}
            className="border p-2 rounded w-full"
          />

          <button
            onClick={handleSubmitBid}
            className="mt-2 w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-800"
          >
            Submit Bid
          </button>

          <div className="mt-4">
            <h4 className="font-bold mb-2">All Bidders</h4>
            {bids.map((bid: Bid, i: number) => (
            <div key={i} className="flex justify-between border-b py-1">
                <span>{bid.bidder.fullName}</span> 
                <span>${bid.amount}</span>
            </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}
