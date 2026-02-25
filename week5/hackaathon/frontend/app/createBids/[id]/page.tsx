"use client";
import { useState, useEffect } from "react";
import {
  useCreateBidMutation,
  useGetCarByIdQuery,
  useGetBidsQuery,
} from "../../../features/api/apiSlice";
import TimeLeft from "../../../components/TimeLeft";
import type { Car, Bid } from "../../../features/api/apiSlice";
import { useParams } from "next/navigation";

export default function CreateBidsPage() {
  const params = useParams();
  const carId = params.id as string;

  const {
    data: car,
    isLoading: carLoading,
    error: carError,
  } = useGetCarByIdQuery(carId || "", { skip: !carId });
  const { data: bids = [], refetch } = useGetBidsQuery(carId || "", {
    skip: !carId,
  });

  const [bidAmount, setBidAmount] = useState<number>(0);
  const [createBid] = useCreateBidMutation();

  useEffect(() => {
    if (car) {
      setBidAmount(car.currentBid );
    }
  }, [car]);

  if (!carId) return <p>Loading car ID...</p>;
  if (carLoading) return <p>Loading car details...</p>;
  if (carError) return <p>Failed to load car details.</p>;
  if (!car) return <p>Car not found</p>;

  const handleSubmitBid = async () => {
     console.log("Submitting bid:", { carId, bidAmount }); 
    if (!bidAmount || bidAmount <= car.currentBid) {
      alert("Bid must be higher than current bid");
      return;
    }
    try {
      const res = await createBid({ carId, amount: bidAmount }).unwrap();
      console.log("Bid response:", res);
      alert("Bid submitted!");
      refetch();
    } catch (err) {
      console.error("Bid error:", err);
      // console.error(err);
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
        <h3 className="text-2xl font-bold">
          {car.year} {car.company} {car.model}
        </h3>
      </div>

      {/* Images Section */}
      <div className="flex gap-2 my-6 px-20">
        {/* Main large image */}
        <div className="flex-1">
          <img
            src={
              car.photos?.[0]
                ? process.env.NEXT_PUBLIC_API_URL + car.photos[0]
                : "/default-car.jpg"
            }
            alt={car.model}
            className="w-full h-[500px] object-cover rounded"
          />
        </div>

        {/* Smaller images */}
        <div className="flex flex-col gap-2 w-1/5">
          {car.photos?.slice(1).map((photo: string, i: number) => (
            <img
              key={i}
              src={process.env.NEXT_PUBLIC_API_URL + photo}
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
          <div className="bg-blue-100 flex flex-wrap justify-between gap-4 p-4 rounded">
            <p>
              <strong>Time Left:</strong> <TimeLeft createdAt={car.createdAt} />
            </p>
            <p>
              <strong>Current Bid:</strong> ${car.currentBid}
            </p>
            <p>
              <strong>Min Increment:</strong> $100
            </p>
            <p>
              <strong>Total Bids:</strong> {bids.length}
            </p>
            <p>
              <strong>Color:</strong> {car.paint}
            </p>
          </div>

          <div className="p-4 bg-white rounded shadow">
            <p>
              Lorem ipsum dolor sit amet consectetur. Duis ac sodales vulputate
              dolor volutpat ac. Turpis ut neque eu adipiscing nibh nunc
              gravida. Ipsum at feugiat id dui elementum nibh nec suspendisse.
              Ut sapien metus elementum tincidunt euismod.
            </p>
          </div>

          {bids.length > 0 && (
            <div className="py-4 bg-white rounded shadow mt-4">
              <h3 className="font-bold mb-2 bg-blue-900 text-white p-2">
                Top Bidder
              </h3>
              <p>
                <strong>Full Name:</strong> {bids[0].user?.fullName ?? "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {bids[0].user?.email ?? "N/A"}
              </p>
              <p>
                <strong>Amount:</strong> ${bids[0].amount}
              </p>
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
            {bids.length > 0 ? (
              bids.map((bid: Bid, i: number) => (
                <div
                  key={i}
                  className="flex justify-between border-b py-1 text-sm"
                >
                  <span>{bid.user?.fullName ?? "Unknown User"}</span>
                  <span>${bid.amount}</span>
                </div>
              ))
            ) : (
              <p>No bids yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


// "use client";
// import { useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { useCreateBidMutation, useGetCarByIdQuery } from "../../features/api/apiSlice";
// import TimeLeft from "../../components/TimeLeft";

// export default function CreateBidPage() {
//   const params = useSearchParams();
//   const id = params.get("id"); // ✅ get from ?id=...

//   const { data: car, isLoading, error } = useGetCarByIdQuery(id as string, { skip: !id });
//   const [createBid] = useCreateBidMutation();
//   const [amount, setAmount] = useState<number>(0);

//   if (!id) return <p>❌ Car ID is missing in URL</p>;
//   if (isLoading) return <p>Loading...</p>;
//   if (error || !car) return <p>Car not found</p>;

//   const handleBid = async () => {
//     try {
//       await createBid({ carId: car.id, amount }).unwrap();
//       alert("✅ Bid placed successfully!");
//       setAmount(0);
//     } catch (err) {
//       console.error(err);
//       alert("❌ Failed to place bid");
//     }
//   };

//   return (
//     <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow">
//       <h1 className="text-2xl font-bold mb-4">
//         {car.company} {car.model}
//       </h1>

//       <div className="mb-4">
//         <img
//           src={car.image}
//           alt={car.model}
//           className="w-full h-64 object-cover rounded-lg"
//         />
//       </div>

//       <p className="mb-2 text-gray-600">Year: {car.year}</p>
//       <p className="mb-2 text-gray-600">Paint: {car.paint}</p>
//       <p className="mb-2 text-gray-600">Mileage: {car.mileage ?? "N/A"}</p>
//       <p className="mb-2 text-gray-600">Current Bid: ${car.currentBid}</p>

//       <p className="mb-4 font-semibold">
//         Auction ends in: <TimeLeft createdAt={car.createdAt} durationDays={4} />
//       </p>

//       <div className="flex items-center gap-2">
//         <input
//           type="number"
//           value={amount}
//           onChange={(e) => setAmount(Number(e.target.value))}
//           placeholder="Enter bid amount"
//           className="border rounded px-3 py-2 w-full"
//         />
//         <button
//           onClick={handleBid}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Place Bid
//         </button>
//       </div>
//     </div>
//   );
// }
