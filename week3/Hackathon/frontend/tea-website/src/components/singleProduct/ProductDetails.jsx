import React, { useEffect, useState } from "react";
import { TbWorld } from "react-icons/tb";
import { MdOutlineRedeem } from "react-icons/md";
import { MdOutlineEco } from "react-icons/md";
import { IoBagHandleOutline } from "react-icons/io5";
import Button from "../shared/buttons/button";
import { addToCart } from "../../services/cartServices";
import { toast } from "react-toastify";
const ProductDetails = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const handleDecreaseQuantity = () => {
    setQuantity((prev) => {
      if (prev == 1) {
        return prev;
      } else {
        return prev - 1;
      }
    });
  };
  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);
  const handleIncreaseQuantity = () => {
    setQuantity((prev) => {
      if (prev == 10) {
        return prev;
      } else {
        return prev + 1;
      }
    });
  };

  const handleAddBag = async () => {
    if (!product || !selectedVariant) return;

    const data = {
      prod_id: product._id,
      variant: selectedVariant.weight,
      quantity: quantity,
    };
    // console.log("Adding to cart:", data);

    const result = await addToCart(data);
    // console.log(result)
    if (result?.success) {
      toast.success(result?.message);
    }
    else{
      if(result.message === "Not authorized, no token provided"){
        toast.error("Login First")
      }
    }
  };

  return (
    <div className="md:max-w-[574px] lg:min-h-[507px] flex flex-col gap-5 px-4 sm:px-10 md:px-0">
      <h1 className="lg:text-4xl sm:text-3xl text-2xl  font-prosto lg:leading-11 leading-8 text-[#282828]">
        {product?.name}
      </h1>
      <p className="sm:text-base text-sm lg:leading-6 leading-5 font-montserrat text-[#282828]">
        {product?.description}
      </p>
      <div className="flex items-center lg:gap-14 md:gap-4 gap-10 flex-wrap">
        {product?.attributes?.origin.length > 0 && (
          <div className="flex items-center lg:gap-2 gap-1">
            <TbWorld className="lg:h-6 lg:w-6 md:w-5 md:h-5 h-6 w-6 text-[#282828]" />
            <p className="font-montserrat sm:text-base text-sm sm:leading-6 leading-5 font-medium sm:tracking-[0.15px] tracking-[0.1px] text-[#282828]">
              Origin: {product?.attributes?.origin[0]}
            </p>
          </div>
        )}
        {product && (
          <div className="flex items-center lg:gap-2 gap-1">
            <MdOutlineRedeem className="lg:h-6 lg:w-6 md:w-5 md:h-5 h-6 w-6 text-[#282828]" />
            <p className="font-montserrat sm:text-base text-sm sm:leading-6 leading-5 font-medium sm:tracking-[0.15px] tracking-[0.1px] text-[#282828]">
              {product.organic === true ? "Organic" : "Non-organic"}
            </p>
          </div>
        )}
        <div className="flex items-center lg:gap-2 gap-1">
          <MdOutlineEco className="lg:h-6 lg:w-6 md:w-5 md:h-5 h-6 w-6  text-[#282828]" />
          <p className="font-montserrat sm:text-base text-sm sm:leading-6 leading-5 font-medium sm:tracking-[0.15px] tracking-[0.1px] text-[#282828]">
            Vegan
          </p>
        </div>
      </div>

      {/* Price */}
      <p className="lg:text-4xl md:text-3xl text-4xl font-prosto lg:leading-11 md:leading-8 leading-11 text-[#282828]">
        €{selectedVariant?.price || "0.00"}
      </p>

      {/* Variants */}
      <div>
        <p className="text-base font-medium text-[#282828] lg:leading-6 tracking-[0.15px] font-montserrat">
          Variants
        </p>

        <div className="flex py-[10px] xl:gap-3.5 lg:gap-2 gap-3.5 text-[#282828] sm:flex-wrap sm:justify-start justify-between overflow-x-auto">
          {product?.variants?.map((item, index) => {
            const isActive = selectedVariant?._id === item._id; // highlight selected
            return (
              <div
                key={index}
                onClick={() => setSelectedVariant(item)}
                className={`lg:max-w-[84px] w-[84px] cursor-pointer py-[10px] px-1 flex flex-col items-center md:shrink shrink-0 rounded-sm transition 
                  ${
                    isActive
                      ? "border-2 border-[#282828] bg-gray-100"
                      : "border border-gray-300"
                  }`}
              >
                <MdOutlineRedeem className="lg:w-[42px] lg:h-[53px] w-8 h-10" />
                <span className="text-sm font-montserrat leading-5 tracking-[0.25px]">
                  {item.weight} bag
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="md:h-[56px]  flex flex-wrap gap-6 items-center">
        <div className="flex w-[96px] gap-2 p-1">
          <button
            className="h-6 w-6 text-[22px] leading-7 flex items-center justify-center font-montserrat text-black cursor-pointer hover:bg-gray-100"
            onClick={handleDecreaseQuantity}
          >
            -
          </button>
          <span className="h-6 w-6 text-[22px] leading-7 flex items-center justify-center font-montserrat text-black">
            {quantity}
          </span>
          <button
            className="h-6 w-6 text-[22px] leading-7 flex items-center justify-center font-montserrat text-black cursor-pointer hover:bg-gray-100"
            onClick={handleIncreaseQuantity}
          >
            +
          </button>
        </div>
        <Button
          className="flex items-center gap-2 bg-[#282828] text-white justify-center  max-w-[264px] md:h-[56px] h-[40px]"
          onClick={handleAddBag}
        >
          <IoBagHandleOutline /> ADD TO BAG{" "}
        </Button>
      </div>
    </div>
  );
};

export default React.memo(ProductDetails);
