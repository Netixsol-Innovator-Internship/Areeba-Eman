"use client";
import { useState, useEffect } from "react";
import { useCheckoutMutation, useProfileQuery } from "@/features/api/apiSlice";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function CheckoutPage() {
  const { data: me } = useProfileQuery(); // fetch logged-in user
  const [checkout, { isLoading }] = useCheckoutMutation();

  const [addressInfo, setAddressInfo] = useState({
    fullName: "",
    street: "",
    city: "",
    zip: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("");
  const [hasEnoughPoints, setHasEnoughPoints] = useState(true);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (paymentMethod === "points" && me) {
      setHasEnoughPoints(me.loyaltyPoints > 0);
    } else {
      setHasEnoughPoints(true);
    }
  }, [paymentMethod, me]);

  const handleCheckout = async () => {
    if (paymentMethod === "") {
      alert("Please select a payment method");
      return;
    }

    if (paymentMethod === "points" && !hasEnoughPoints) {
      alert("You don't have enough loyalty points.");
      return;
    }

    try {
      // 1. Create order / PaymentIntent in backend
      const body = { addressInfo };
      if (paymentMethod === "points") body.usePoints = true;
      else body.paymentInfo = { method: "card" };

      const orderData = await checkout(body).unwrap();

      // 2. If card payment, confirm payment with Stripe
      if (paymentMethod === "card") {
        if (!stripe || !elements) return;

        const cardElement = elements.getElement(CardElement);
        const result = await stripe.confirmCardPayment(orderData.clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: { name: addressInfo.fullName },
          },
        });

        if (result.error) {
          alert(`Payment failed: ${result.error.message}`);
          return;
        } else if (result.paymentIntent.status === "succeeded") {
          alert(`✅ Payment successful! Order ID: ${orderData.orderId}`);
        }
      } else {
        alert(`✅ Order placed using loyalty points! Order ID: ${orderData.orderId}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Checkout failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold">Checkout</h1>

      {/* Address */}
      {["fullName", "street", "city", "zip"].map((field) => (
        <input
          key={field}
          type="text"
          placeholder={field === "fullName" ? "Full Name" : field.charAt(0).toUpperCase() + field.slice(1)}
          value={addressInfo[field]}
          onChange={(e) => setAddressInfo({ ...addressInfo, [field]: e.target.value })}
          className="border p-2 w-full"
        />
      ))}

      {/* Payment Method */}
      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="border p-2 w-full"
      >
        <option value="">Select Payment Method</option>
        <option value="card">Card</option>
        <option value="points">Loyalty Points</option>
      </select>

      {/* Loyalty points info */}
      {paymentMethod === "points" && (
        <div className="p-2 border rounded bg-yellow-50 text-sm">
          You have <b>{me?.loyaltyPoints ?? 0}</b> loyalty points.
        </div>
      )}

      {/* Stripe CardElement */}
      {paymentMethod === "card" && (
        <div className="p-2 border rounded">
          <CardElement options={{ hidePostalCode: true }} />
        </div>
      )}

      <button
        onClick={handleCheckout}
        disabled={isLoading || (paymentMethod === 'card' && !stripe)}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {isLoading ? 'Placing Order...' : 'Place Order'}
      </button>
    </div>
  );
}
