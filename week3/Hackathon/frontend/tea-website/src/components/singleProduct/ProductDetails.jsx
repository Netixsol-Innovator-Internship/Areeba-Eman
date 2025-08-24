import React, { useEffect, useState } from "react";
import { TbWorld } from "react-icons/tb";
import { MdOutlineRedeem } from "react-icons/md";
import { MdOutlineEco } from "react-icons/md";
import { IoBagHandleOutline } from "react-icons/io5";
import Button from "../shared/buttons/button";
import { toast } from "react-toastify";
import { useAddToCartMutation } from "../../redux/slices/cartApiSlice";

const ProductDetails = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [addToCart, { isLoading }] = useAddToCartMutation();

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => (prev === 1 ? prev : prev - 1));
  };
  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => (prev === 10 ? prev : prev + 1));
  };

  const handleAddBag = async () => {
    if (!product || !selectedVariant) return;

    const body = {
      prod_id: product._id,
      variant: selectedVariant.weight,
      quantity,
    };

    try {
      const result = await addToCart(body).unwrap();
      if (result?.success) {
        toast.success(result?.message || 'Added to cart');
      } else {
        toast.error(result?.message || 'Failed to add to cart');
      }
    } catch (err) {
      const msg = err?.data?.message;
      if (msg === "Not authorized, no token provided") {
        toast.error("Login First");
      } else {
        toast.error(msg || "Failed to add to cart");
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
        {product?.attributes?.origin?.length > 0 && (
          <div className="flex items-center lg:gap-2 gap-1">
            <TbWorld className="lg:h-6 lg:w-6 md:w-5 md:h-5 h-6 w-6 text-[#282828]" />
            <p className="font-montserrat sm:text-base text-sm sm:leading-6 leading-5 font-medium text-[#282828]">
              Origin: {product?.attributes?.origin[0]}
            </p>
          </div>
        )}
        {product && (
          <div className="flex items-center lg:gap-2 gap-1">
            <MdOutlineRedeem className="lg:h-6 lg:w-6 md:w-5 md:h-5 h-6 w-6 text-[#282828]" />
            <p className="font-montserrat sm:text-base text-sm sm:leading-6 leading-5 font-medium text-[#282828]">
              {product.organic === true ? "Organic" : "Non-organic"}
            </p>
          </div>
        )}
        <div className="flex items-center lg:gap-2 gap-1">
          <MdOutlineEco className="lg:h-6 lg:w-6 md:w-5 md:h-5 h-6 w-6  text-[#282828]" />
          <p className="font-montserrat sm:text-base text-sm sm:leading-6 leading-5 font-medium text-[#282828]">
            Vegan
          </p>
        </div>
      </div>

      <p className="lg:text-4xl md:text-3xl text-4xl font-prosto lg:leading-11 md:leading-8 leading-11 text-[#282828]">
        €{selectedVariant?.price || "0.00"}
      </p>

      <div>
        <p className="text-base font-medium text-[#282828] lg:leading-6 tracking-[0.15px] font-montserrat">
          Variants
        </p>

        <div className="flex py-[10px] xl:gap-3.5 lg:gap-2 gap-3.5 text-[#282828] sm:flex-wrap sm:justify-start justify-between overflow-x-auto">
          {product?.variants?.map((item) => {
            const isActive = selectedVariant?._id === item._id;
            return (
              <div
                key={item._id}
                onClick={() => setSelectedVariant(item)}
                className={`lg:max-w-[84px] w-[84px] cursor-pointer py-[10px] px-1 flex flex-col items-center md:shrink shrink-0 rounded-sm transition 
                  ${isActive ? "border-2 border-[#282828] bg-gray-100" : "border border-gray-300"}`}
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

      <div className="md:h-[56px] flex flex-wrap gap-6 items-center">
        <div className="flex w-[96px] gap-2 p-1">
          <button
            className="h-6 w-6 text-[22px] leading-7 flex items-center justify-center font-montserrat text-black hover:bg-gray-100"
            onClick={handleDecreaseQuantity}
            disabled={isLoading}
          >
            -
          </button>
          <span className="h-6 w-6 text-[22px] leading-7 flex items-center justify-center font-montserrat text-black">
            {quantity}
          </span>
          <button
            className="h-6 w-6 text-[22px] leading-7 flex items-center justify-center font-montserrat text-black hover:bg-gray-100"
            onClick={handleIncreaseQuantity}
            disabled={isLoading}
          >
            +
          </button>
        </div>
        <Button
          className="flex items-center gap-2 bg-[#282828] text-white justify-center max-w-[264px] md:h-[56px] h-[40px]"
          onClick={handleAddBag}
          disabled={isLoading}
        >
          <IoBagHandleOutline /> {isLoading ? 'ADDING...' : 'ADD TO BAG'}
        </Button>
      </div>
    </div>
  );
};

export default React.memo(ProductDetails);
