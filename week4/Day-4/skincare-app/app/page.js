"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useGetProductsQuery } from "../features/api/skincareApi";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [brand, setBrand] = useState("maybelline");
  const [showFavourites, setShowFavourites] = useState(false);

  const favourites = useSelector((state) => state.favourites);
  const { data, error, isLoading } = useGetProductsQuery(brand, { skip: showFavourites });

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center text-pink-600">
        Skincare Product Finder
      </h1>

      {/* Brand Buttons */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        {[
          { label: "Maybelline", value: "maybelline" },
          { label: "Covergirl", value: "covergirl" },
          { label: "L'Oréal", value: "l'oreal" }, // ✅ fixed
        ].map((b) => (
          <button
            key={b.value}
            onClick={() => {
              setShowFavourites(false);
              setBrand(b.value);
            }}
            className={`px-4 py-2 rounded-xl shadow-sm transition ${
              brand === b.value && !showFavourites
                ? "bg-pink-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {b.label}
          </button>
        ))}

        {/* Show Favourites */}
        <button
          onClick={() => setShowFavourites(true)}
          className={`px-4 py-2 rounded-xl shadow-sm transition ${
            showFavourites ? "bg-pink-500 text-white" : "bg-yellow-200 hover:bg-yellow-300"
          }`}
        >
          Favourites ({favourites.length})
        </button>
      </div>

      {/* Loader & Error */}
      {!showFavourites && isLoading && <p className="text-center">Loading...</p>}
      {error && !showFavourites && (
        <p className="text-center text-red-500">Something went wrong!</p>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {showFavourites
          ? favourites.map((p) => <ProductCard key={p.id} product={p} />)
          : data?.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </main>
  );
}
