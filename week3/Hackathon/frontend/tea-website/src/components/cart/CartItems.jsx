import React from "react";
import { Minus, Plus } from "lucide-react";
import { products } from "../../constants/gernal";
import Button from "../shared/buttons/button";
import {
  decreaseQuantity,
  increaseQuantity,
  removeItemFromCart,
} from "../../services/cartServices";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CartItems = ({ cartProducts, fetchCartProducts, subtotal }) => {
  const navigate = useNavigate();
  const handleIncreaseQuantity = async (id) => {
    let result = await increaseQuantity(id);
    if (result?.success) {
      fetchCartProducts();
      toast.success(result?.message);
    }
  };
  const handledecreaseQuantity = async (id) => {
    let result = await decreaseQuantity(id);
    if (result?.success) {
      fetchCartProducts();
      toast.success(result?.message);
    }
  };

  const handleRemoveBtn = async (id) => {
    let result = await removeItemFromCart(id);
    if (result?.success) {
      fetchCartProducts();
      toast.success(result?.message);
    }
  };

  const handleShoppingBtn = () => {
    navigate("/collections");
  };
  return (
    <div className="sm:w-[455px] font-montserrat mb-12">
      {/* cart item */}
      {Array.isArray(cartProducts) && cartProducts.length > 0 ? (
        cartProducts.map((product) => (
          <div
            key={product.cartItemId}
            className="flex items-center gap-2 sm:gap-4 w-full py-3"
          >
            {/* image - left*/}
            <div className="w-12 h-12 sm:w-[71px] sm:h-[71px]">
              <img
                src={
                  `${import.meta.env.VITE_API_URL}/uploads/${product.image}` ||
                  "/placeholder.svg"
                }
                className="h-full w-full object-cover rounded"
              />
            </div>
            {/* right */}
            <div className="flex flex-col sm:gap-3 justify-between w-full">
              {/* description + items btn */}
              <div className="flex justify-between w-full">
                <p className="text-[8px] sm:text-sm w-[100px] sm:w-[200px]">
                  {product.name} - {product?.variant}
                </p>
                <div className="flex items-center justify-between w-[50px] sm:w-[70px]">
                  <span
                    className="cursor-pointer"
                    onClick={() => handledecreaseQuantity(product.cartItemId)}
                  >
                    <Minus size={14} />
                  </span>
                  <span className="text-sm sm:text-xl">{product.quantity}</span>
                  <span
                    className="cursor-pointer"
                    onClick={() => handleIncreaseQuantity(product.cartItemId)}
                  >
                    <Plus size={14} />
                  </span>
                </div>
              </div>
              {/* remove btn + price */}
              <div className="flex items-center justify-between text-sm">
                <button
                  onClick={() => handleRemoveBtn(product.cartItemId)}
                  className="uppercase cursor-pointer text-[10px] sm:text-sm text-gray-600 hover:text-red-600"
                >
                  remove
                </button>
                <span className="text-[12px] sm:text-sm">€{product.price}</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No Item in cart</p>
      )}

      <div className="border-b border-[#A0A0A0] mt-4 mx-6"></div>

      <div className="flex items-center justify-between py-8 w-full">
        <span>subtotal</span>
        <span className="font-medium">€{subtotal}</span>
      </div>
      <div className="flex items-center justify-center w-full">
        <Button className="border" onClick={handleShoppingBtn}>
          {" "}
          back to shopping{" "}
        </Button>
      </div>
    </div>
  );
};

export default React.memo(CartItems);
