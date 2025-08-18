import React from "react";

const ProductInfoSection = ({children}) => {
  return (
    <section className="py-10  px-4 sm:px-10 lg:px-12 grid lg:grid-cols-2 lg:gap-24 gap-6">
      {children}
    </section>
  );
};

export default ProductInfoSection;
