import React, { useEffect, useState } from "react";
import Container from "../components/shared/common/Container";
// import { useParams } from "react-router-dom";
import Breadcrumb from "../components/shared/common/Breadcrumb";
import ProductOverview from "../components/singleProduct/ProductOverview";
import ProductImage from "../components/singleProduct/ProductImage";
import ProductDetails from "../components/singleProduct/ProductDetails";
import img from "../assets/collections/img1.jpg";
import ProductInfoSection from "../components/singleProduct/ProductInfoSection";
import SteepingInstructions from "../components/singleProduct/SteepingInstructions";
import ProductDescription from "../components/singleProduct/ProductDescription";
import RelatedProducts from "../components/shared/common/RelatedProducts";
import { getProductBySlug } from "../services/productService";
import { useParams } from "react-router-dom";
const SingleProductPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState([]);
  useEffect(() => {
    const fetchProduct = async () => {
      let result = await getProductBySlug(slug);
      // console.log(result.data);
      setProduct(result.data);
    };
    fetchProduct();
  }, [slug]);
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
              img={`${import.meta.env.VITE_API_URL}/uploads/${
                product?.images?.[0]
              }`}
            />
            <ProductDetails product={product} />
          </ProductOverview>
        </Container>
      </div>

      <div className="bg-[#F4F4F4] w-full flex justify-center mb-12">
        <Container>
          <ProductInfoSection>
            <SteepingInstructions
              steepingInstructions={product?.steepingInstructions}
            />
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
