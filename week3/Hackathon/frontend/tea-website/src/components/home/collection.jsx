import { useEffect } from "react";
import Container from "../shared/common/Container";
import { Link } from "react-router-dom";
import { useGetCollectionsQuery } from "../../redux/slices/productApiSlice";

const Collection = () => {
  const { data, isFetching } = useGetCollectionsQuery();
  const collections = data?.collections || [];

  useEffect(() => {
    // (optional) any side effects
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <Container>
        <div className="collections flex-col justify-center items-center pb-14 pt-3  px-6 sm:px-10 lg:px-12">
          <h2 className="text-center text-2xl sm:text-3xl lg:text-[32px] font-prosto my-12">
            Our Collections
          </h2>

          <div className="w-full flex flex-wrap justify-start sm:justify-between items-center gap-4 sm:gap-6 lg:gap-7">
            {isFetching && <p>Loading...</p>}
            {Array.isArray(collections) && collections.map((item, index) => (
              <Link to={'/collections'}
                key={index}
                className="text-center mb-6 w-[calc(50%-0.5rem)] sm:w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(33.333%-1.167rem)] max-w-[360px]"
              >
                <img
                  src={`${import.meta.env.VITE_API_URL}/uploads/${item.image}` || "/placeholder.svg"}
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
