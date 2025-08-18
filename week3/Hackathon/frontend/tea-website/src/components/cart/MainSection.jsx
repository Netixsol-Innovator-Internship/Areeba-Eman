import { useEffect, useState } from "react";
import CartItems from "./CartItems";
import OrderSummary from "./OrderSummary";
import { getCartProducts } from "../../services/cartServices";

const MainSection = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [subtotal, setSubTotal] = useState(0);
  const [delivery, setDelivery] = useState(3.5);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    if (Array.isArray(cartProducts)) {
      let t = cartProducts.reduce(
        (total, current) => total + (current.total || 0),
        0
      );
      setSubTotal(t);
      setTotal(delivery + t);
    }
  }, [cartProducts]);
  const fetchCartProducts = async () => {
    let result = await getCartProducts();
    console.log(result.data);
    setCartProducts(result.data || []);
  };
  useEffect(() => {
    fetchCartProducts();
  }, []);
  return (
    <div className="py-6 flex flex-col lg:flex-row items-center lg:items-start justify-between">
      <CartItems
        subtotal={subtotal}
        cartProducts={cartProducts}
        fetchCartProducts={fetchCartProducts}
      />
      <OrderSummary subtotal={subtotal} total={total} delivery={delivery} />
    </div>
  );
};

export default MainSection;
