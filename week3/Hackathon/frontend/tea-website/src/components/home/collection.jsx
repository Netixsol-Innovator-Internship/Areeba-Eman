import { useEffect, useState } from "react";
import { Collections } from "../../constants/gernal";
import Container from "../shared/common/Container";
import { getAllCollections } from "../../services/productService";
import { Link } from "react-router-dom";

const Collection = () => {
  const [collections, setCollections] = useState([]);
  useEffect(() => {
    const fetchCollections = async () => {
      const result = await getAllCollections();
      console.log(result);
      setCollections(result.collections);
    };

    fetchCollections();
  }, []);
  return (
    <div className="flex flex-col items-center justify-center">
      <Container>
        <div className="collections flex-col justify-center items-center pb-14 pt-3  px-6 sm:px-10 lg:px-12">
          {/*collections area */}
          <h2 className="text-center text-2xl sm:text-3xl lg:text-[32px] font-prosto my-12">
            Our Collections
          </h2>

          <div className="w-full flex flex-wrap justify-start sm:justify-between items-center gap-4 sm:gap-6 lg:gap-7">
            {Array.isArray(collections) && collections.map((item, index) => (
              <Link to={'/collections'}
                key={index}
                className="
    text-center 
    mb-6
    w-[calc(50%-0.5rem)]   /* 2 columns for small screens */
    sm:w-[calc(50%-0.75rem)] 
    md:w-[calc(33.333%-1rem)] 
    lg:w-[calc(33.333%-1.167rem)] 
    max-w-[360px]"
              >
                <img
                  src={
                    `${import.meta.env.VITE_API_URL}/uploads/${item.image}` ||
                    "/placeholder.svg"
                  }
                  alt={item.collection}
                  className="w-full aspect-square object-cover rounded mx-auto"
                />
                <p className="mt-3.5 font-medium font-montserrat text-sm sm:text-base">
                  {item.collection}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Collection;
