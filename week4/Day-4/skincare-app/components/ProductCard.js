import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { addFavourite, removeFavourite } from "../features/favourites/favouritesSlice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const favourites = useSelector((state) => state.favourites);
  const isFavourite = favourites.find((item) => item.id === product.id);

  return (
    <div className="p-4 border rounded-2xl shadow-sm bg-white hover:shadow-lg transition flex flex-col">
      <div className="relative w-full h-48 mb-3">
        <Image
          src={product.image_link || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-contain rounded-lg bg-gray-50"
        />
      </div>
      <h2 className="text-lg font-semibold line-clamp-2">{product.name}</h2>
      <p className="text-sm text-gray-500">{product.brand}</p>
      <p className="text-pink-600 font-bold">${product.price || "N/A"}</p>

      <div className="mt-auto flex justify-between items-center gap-2 pt-3">
        <a
          href={product.product_link}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 text-sm rounded-lg bg-pink-100 text-pink-700 hover:bg-pink-200"
        >
          View
        </a>
        {isFavourite ? (
          <button
            onClick={() => dispatch(removeFavourite(product.id))}
            className="px-3 py-1 text-sm rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
          >
            Remove
          </button>
        ) : (
          <button
            onClick={() => dispatch(addFavourite(product))}
            className="px-3 py-1 text-sm rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
          >
            Fav
          </button>
        )}
      </div>
    </div>
  );
}
