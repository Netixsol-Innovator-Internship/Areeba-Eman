import { useEffect } from "react"
import MainPage from "../components/products/MainPage"
import TopSection from "../components/products/TopSection"
import Breadcrumb from "../components/shared/common/Breadcrumb"
import RelatedProducts from "../components/shared/common/RelatedProducts"
import { useLocation } from "react-router-dom"

const ProductsPage = () => {
   const { pathname } = useLocation();
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, [pathname]);
  return (
    <>
    <TopSection/>
    <Breadcrumb/>
    <MainPage/>
    </>
  )
}

export default ProductsPage