import React from "react";

const ProductDescription = ({ product }) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        <h3 className="md:text-[32px] text-2xl leading-7 font-montserrat text-[#282828]">
          About this tea
        </h3>
        <div>
          <ul className="flex md:gap-7 gap-[9px] flex-wrap">
            {product?.attributes?.flavor?.length > 0 && (
              <>
                {" "}
                <li>
                  <h5 className="text-sm font-montserrat sm:leading-5 text-[#282828] font-medium">
                    FLAVOR
                  </h5>
                  <p className="text-sm font-montserrat leading-5 text-[#282828]">
                    {product?.attributes?.flavor[0]}
                  </p>
                </li>
                <div className="border-r border-r-[#A0A0A0] "></div>
              </>
            )}
            {product?.attributes?.qualities?.length > 0 && (
              <>
                {" "}
                <li>
                  <h5 className="text-sm font-montserrat sm:leading-5 text-[#282828] font-medium">
                    QUALITIES
                  </h5>
                  <p className="text-sm font-montserrat leading-5 text-[#282828]">
                    {product?.attributes?.qualities[0]}
                  </p>
                </li>
                <div className="border-r border-r-[#A0A0A0] "></div>
              </>
            )}
            {product?.caffeine && (
              <>
                {" "}
                <li>
                  <h5 className="text-sm font-montserrat sm:leading-5 text-[#282828] font-medium">
                    CAFFEINE
                  </h5>
                  <p className="text-sm font-montserrat leading-5 text-[#282828]">
                    {product?.caffeine}
                  </p>
                </li>
                <div className="border-r border-r-[#A0A0A0] "></div>
              </>
            )}
            {product?.attributes?.allergens.length > 0 && (
              <>
                {" "}
                <li>
                  <h5 className="text-sm font-montserrat sm:leading-5 text-[#282828] font-medium">
                     ALLERGENS
                  </h5>
                  <p className="text-sm font-montserrat leading-5 text-[#282828]">
                    {product?.attributes?.allergens[0]}
                  </p>
                </li>
                
              </>
            )}
          </ul>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <h3 className="md:text-[32px] text-2xl leading-7 font-montserrat text-[#282828]">
          Ingredient
        </h3>
        <p className="text-sm leading-5">
          {product?.ingredients}
        </p>
      </div>
    </div>
  );
};

export default React.memo(ProductDescription);
