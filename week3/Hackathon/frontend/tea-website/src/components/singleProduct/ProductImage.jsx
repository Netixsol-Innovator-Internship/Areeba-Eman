import React from "react";

const ProductImage = ({img}) => {
  return (
    <div className="md:max-w-[456px] overflow-hidden md:h-[507px] h-[393px] sm:h-[450px]">
      <img src={img} alt="" className="h-full w-full object-cover "  />    
    </div>
  );
};

export default React.memo(ProductImage);
