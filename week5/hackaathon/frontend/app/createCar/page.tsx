"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateCarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    sellerType: "individual",
    sellerFirstName: "",
    sellerLastName: "",
    sellerEmail: "",
    sellerPhone: "",
    vin: "",
    year: "",
    make: "",
    model: "",
    mileage: "",
    engineSize: "",
    paint: "",
    hasGccSpecs: false,
    noteworthyOptions: "",
    accidentHistory: false,
    fullServiceHistory: false,
    modification: "stock",
    maxBid: "",
    status: "upcoming",
  });
  const [photos, setPhotos] = useState<File[]>([]);

  // ✅ safer handleChange with checkbox support
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setForm((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== "" && value !== undefined) {
          fd.append(key, value as any);
        }
      });
      photos.forEach((file) => fd.append("photos", file));

      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/cars", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // adjust if needed
        },
        body: fd,
      });

      if (!res.ok) throw new Error("Failed to create car");

      router.push("/carAuction"); // ✅ redirect to Car Auction page
    } catch (err) {
      console.error(err);
      alert("Error creating car");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">

      {/* Page Heading */}
      <header className="text-center my-8">
        <h2 className="text-3xl font-bold">Sell Your Car</h2>
        <p className="text-gray-600">Fill in your details and car information</p>
      </header>

      {/* Form */}
      <main className="flex-grow px-6 max-w-3xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white shadow-md rounded-2xl p-6"
        >
          {/* Seller Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Your Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                name="sellerType"
                value={form.sellerType}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="individual">Individual</option>
                <option value="dealer">Dealer</option>
              </select>
              <input
                type="text"
                name="sellerFirstName"
                placeholder="First Name"
                value={form.sellerFirstName}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="sellerLastName"
                placeholder="Last Name"
                value={form.sellerLastName}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                type="email"
                name="sellerEmail"
                placeholder="Email"
                value={form.sellerEmail}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="sellerPhone"
                placeholder="Phone"
                value={form.sellerPhone}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>
          </div>

          {/* Car Details */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Car Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="vin"
                placeholder="VIN"
                value={form.vin}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
                type="number"
                name="year"
                placeholder="Year"
                value={form.year}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                name="make"
                placeholder="Make"
                value={form.make}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                name="model"
                placeholder="Model"
                value={form.model}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
                type="number"
                name="mileage"
                placeholder="Mileage (km)"
                value={form.mileage}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="engineSize"
                placeholder="Engine Size"
                value={form.engineSize}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="paint"
                placeholder="Paint Color"
                value={form.paint}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
                type="number"
                name="maxBid"
                placeholder="Max Bid"
                value={form.maxBid}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              {/* ✅ Status field */}
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="upcoming">Upcoming</option>
                <option value="live">Live</option>
              </select>
            </div>

            {/* Checkboxes */}
            <div className="mt-4 flex flex-col gap-2">
              <label>
                <input
                  type="checkbox"
                  name="hasGccSpecs"
                  checked={form.hasGccSpecs}
                  onChange={handleChange}
                />{" "}
                GCC Specs
              </label>
              <label>
                <input
                  type="checkbox"
                  name="accidentHistory"
                  checked={form.accidentHistory}
                  onChange={handleChange}
                />{" "}
                Accident History
              </label>
              <label>
                <input
                  type="checkbox"
                  name="fullServiceHistory"
                  checked={form.fullServiceHistory}
                  onChange={handleChange}
                />{" "}
                Full Service History
              </label>
            </div>

            <textarea
              name="noteworthyOptions"
              placeholder="Noteworthy Options"
              value={form.noteworthyOptions}
              onChange={handleChange}
              className="border p-2 rounded w-full mt-4"
            />
          </div>

          {/* Photos */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Upload Photos</h3>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            {loading ? "Submitting..." : "Submit Car"}
          </button>
        </form>
      </main> 
    </div>
  );
}
