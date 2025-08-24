import React, { useEffect } from "react";
import Container from "../components/shared/common/Container";
import Breadcrumb from "../components/shared/common/Breadcrumb";
import ProductOverview from "../components/singleProduct/ProductOverview";
import ProductImage from "../components/singleProduct/ProductImage";
import ProductDetails from "../components/singleProduct/ProductDetails";
import ProductInfoSection from "../components/singleProduct/ProductInfoSection";
import SteepingInstructions from "../components/singleProduct/SteepingInstructions";
import ProductDescription from "../components/singleProduct/ProductDescription";
import RelatedProducts from "../components/shared/common/RelatedProducts";
import { useParams } from "react-router-dom";
import { useGetProductBySlugQuery } from "../redux/slices/productApiSlice";

const SingleProductPage = () => {
  const { slug } = useParams();
  const { data } = useGetProductBySlugQuery(slug);
  const product = data?.data;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  return (
    <div className="">
      <Breadcrumb />
      <div className="flex justify-center pb-12">
        <Container>
          <ProductOverview>
            <ProductImage
              img={
                product?.images?.[0]
                  ? `${import.meta.env.VITE_API_URL}/uploads/${product.images[0]}`
                  : "/placeholder.jpg"
              }
            />
            <ProductDetails product={product} />
          </ProductOverview>
        </Container>
      </div>

      <div className="bg-[#F4F4F4] w-full flex justify-center mb-12">
        <Container>
          <ProductInfoSection>
            <SteepingInstructions steepingInstructions={product?.steepingInstructions || {}} />
            <ProductDescription product={product} />
          </ProductInfoSection>
        </Container>
      </div>

      <div className="flex justify-center">
        <Container>
          <RelatedProducts title={"You may also like"} />
        </Container>
      </div>
    </div>
  );
};

export default SingleProductPage;
