import React from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../products/ProductCard";
import { useGetProductsQuery } from "../../../redux/slices/productApiSlice";

const RelatedProducts = ({ title }) => {
  const navigate = useNavigate();
  const { data } = useGetProductsQuery({});
  const products = data?.data || [];

  const handleProductClick = (slug) => navigate(`/product/${slug}`);

  return (
    <div className="flex flex-col items-center justify-center my-12">
      <h1 className="text-2xl md:text-[32px] font-prosto mb-6">{title}</h1>
      <div className="grid grid-cols-2 lg:grid-cols-3 my-6 max-w-[840px] gap-6 px-6 sm:px-10 lg:px-12 ">
        {products.length > 0 &&
          products.slice(0, 3).map((product) => (
            <ProductCard
              onClick={() => handleProductClick(product.slug)}
              key={product._id}
              image={
                product.images?.length
                  ? `${import.meta.env.VITE_API_URL}/uploads/${product.images[0]}`
                  : "/placeholder.jpg"
              }
              title={product.name}
              price={product.variants?.[0]?.price || "N/A"}
              weight={product.variants?.[0]?.weight || "N/A"}
            />
          ))}
      </div>
    </div>
  );
};

export default React.memo(RelatedProducts);
