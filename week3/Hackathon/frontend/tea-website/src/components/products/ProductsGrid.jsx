import React, { useMemo, useState } from "react";
// import { products } from '../../constants/gernal'
import ProductCard from "./ProductCard";
import { useNavigate } from "react-router-dom";

const ProductsGrid = ({ products }) => {
  const navigate = useNavigate();
  const handleProductClick = (slug) => {
    navigate(`/product/${slug}`);
  };
  const [sortBy, setSortBy] = useState("Default");
  const sortedProducts = useMemo(() => {
    let sorted = [...products];

    switch (sortBy) {
      case "High Price":
        sorted.sort((a, b) => b.variants[0].price - a.variants[0].price);
        break;
      case "Low Price":
        sorted.sort((a, b) => a.variants[0].price - b.variants[0].price);
        break;
      case "A - Z":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Z - A":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return sorted;
  }, [products, sortBy]);
  return (
    <div className="w-full">
      <div className="flex items-center justify-end font-montserrat">
        {/* filter */}
        {/* sortings */}
        <select
          className="w-32 p-2 bg-white text-gray-700 focus:outline-none focus:ring-0 cursor-pointer"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option disabled>Sort By</option>
          <option>High Price</option>
          <option>Low Price</option>
          <option>A - Z</option>
          <option>Z - A</option>
          <option>Default</option>
        </select>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 my-6">
        {sortedProducts.slice(0, 10).map((product) => (
          <ProductCard
            onClick={() => handleProductClick(product.slug)}
            key={product._id}
            image={`${import.meta.env.VITE_API_URL}/uploads/${
              product.images[0]
            }`}
            title={product.name}
            price={product.variants[0].price}
            weight={product.variants[0].weight}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(ProductsGrid);
