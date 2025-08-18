import Collection from "../components/home/collection";
import Hero from "../components/home/hero";
import Feature from "../components/home/feature";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Home = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return (
    <>
      {/* hero section */}
      <Hero />
      {/* feaures section */}
      <Feature />
      {/* collections section */}
      <Collection />
    </>
  );
};

export default Home;
