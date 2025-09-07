// "use client"
// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import {
//   useGetCartQuery,
//   useCheckoutMutation,
//   useRemoveFromCartMutation,
// } from "@/features/api/apiSlice"

// export default function CheckoutPage() {
//   const router = useRouter()
//   const { data: cart, isLoading } = useGetCartQuery()
//   const [checkout, { isLoading: isPlacing }] = useCheckoutMutation()
//   const [removeFromCart] = useRemoveFromCartMutation()

//   const [address, setAddress] = useState({
//     street: "",
//     city: "",
//     // state: "",
//     zip: "",
//     country: "",
//   })
//   const [payment, setPayment] = useState("cash")
//   const [usePoints, setUsePoints] = useState(false)

//   if (isLoading) return <p className="p-6">Loading cart...</p>
//   if (!cart?.items?.length) return <p className="p-6">Your cart is empty.</p>

//   const subtotal = cart.items.reduce(
//     (acc, i) => acc + i.unitPrice * i.quantity,
//     0
//   )
//   const discount = usePoints ? Math.min(subtotal * 0.1, 500) : 0
//   const delivery = 15
//   const total = subtotal - discount + delivery

//   const handlePlaceOrder = async () => {
//     try {
//       await checkout({
//         addressInfo: address,
//         paymentInfo: { method: payment, transactionId: `TXN-${Date.now()}` },
//         usePoints,
//       }).unwrap()

//       // also delete cart items explicitly (optional: since tags invalidate too)
//       await Promise.all(cart.items.map((i) => removeFromCart(i.productId)))

//       router.push("/orders/mine")
//     } catch (err) {
//       console.error("Checkout failed", err)
//       alert("Checkout failed. Please try again.")
//     }
//   }

//   return (
//     <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
//       {/* Left - Form */}
//       <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6 space-y-6">
//         <h2 className="text-xl font-semibold">Shipping Address</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <input
//             placeholder="Street"
//             className="border p-3 rounded"
//             value={address.street}
//             onChange={(e) =>
//               setAddress({ ...address, street: e.target.value })
//             }
//           />
//           <input
//             placeholder="City"
//             className="border p-3 rounded"
//             value={address.city}
//             onChange={(e) => setAddress({ ...address, city: e.target.value })}
//           />
//           <input
//             placeholder="State"
//             className="border p-3 rounded"
//             value={address.state}
//             onChange={(e) => setAddress({ ...address, state: e.target.value })}
//           />
//           <input
//             placeholder="Zip"
//             className="border p-3 rounded"
//             value={address.zip}
//             onChange={(e) => setAddress({ ...address, zip: e.target.value })}
//           />
//           <input
//             placeholder="Country"
//             className="border p-3 rounded md:col-span-2"
//             value={address.country}
//             onChange={(e) =>
//               setAddress({ ...address, country: e.target.value })
//             }
//           />
//         </div>

//         <h2 className="text-xl font-semibold mt-6">Payment</h2>
//         <select
//           className="border p-3 rounded w-full"
//           value={payment}
//           onChange={(e) => setPayment(e.target.value)}
//         >
//           <option value="cash">Cash on Delivery</option>
//           <option value="card">Credit / Debit Card</option>
//           <option value="easypaisa">Easypaisa</option>
//         </select>

//         <div className="flex items-center gap-2 mt-4">
//           <input
//             type="checkbox"
//             checked={usePoints}
//             onChange={(e) => setUsePoints(e.target.checked)}
//           />
//           <label>Use my loyalty points for discount</label>
//         </div>
//       </div>

//       {/* Right - Cart Summary */}
//       <div className="bg-white rounded-2xl shadow p-6 space-y-4">
//         <h2 className="text-xl font-semibold">Order Summary</h2>
//         <div className="divide-y">
//           {cart.items.map((i) => (
//             <div
//               key={i.productId}
//               className="flex justify-between py-2 text-sm"
//             >
//               <div>
//                 <p className="font-medium">{i.name}</p>
//                 <p className="text-gray-500">x{i.quantity}</p>
//               </div>
//               <p>PKR {i.unitPrice * i.quantity}</p>
//             </div>
//           ))}
//         </div>
//         <div className="border-t pt-4 space-y-1 text-sm">
//           <div className="flex justify-between">
//             <span>Subtotal</span>
//             <span>PKR {subtotal}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Discount</span>
//             <span>- PKR {discount}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Delivery</span>
//             <span>PKR {delivery}</span>
//           </div>
//           <div className="flex justify-between font-semibold text-lg">
//             <span>Total</span>
//             <span>PKR {total}</span>
//           </div>
//         </div>
//         <button
//           onClick={handlePlaceOrder}
//           disabled={isPlacing}
//           className="w-full mt-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
//         >
//           {isPlacing ? "Placing Order..." : "Place Order"}
//         </button>
//       </div>
//     </div>
//   )
// }
'use client'
import React, { useState } from 'react'
import { useGetCartQuery, useCheckoutMutation } from '@/features/api/apiSlice'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const { data: cart, isLoading } = useGetCartQuery()
  const [checkout] = useCheckoutMutation()
  const router = useRouter()

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  })
  const [payment, setPayment] = useState('card')

  if (isLoading) return <p className="p-6">Loading checkout...</p>
  if (!cart || cart.items.length === 0) return <div className="p-6">Cart is empty.</div>

  const subtotal = cart.items.reduce((s, it) => s + (it.priceAtAdd || 0) * (it.quantity || 0), 0)
  const discount = 0
  const delivery = 15
  const total = subtotal - discount + delivery

  const handleCheckout = async () => {
    const body = {
      addressInfo: address,
      paymentInfo: {
        method: payment,
        transactionId: 'TXN-' + Date.now(),
      },
      usePoints: false
    }
    try {
      await checkout(body).unwrap()
      alert('Order placed successfully!')
      router.push('/') // or /thank-you
    } catch (err) {
      console.error(err)
      alert('Checkout failed')
    }
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <h2 className="text-xl font-bold">Checkout</h2>

        {/* Address Form */}
        <div className="p-4 border rounded space-y-2">
          <h3 className="font-semibold mb-2">Shipping Address</h3>
          {['street', 'city', 'state', 'zip', 'country'].map((field) => (
            <input
              key={field}
              type="text"
              placeholder={field}
              className="w-full border rounded px-3 py-2"
              value={address[field]}
              onChange={(e) => setAddress({ ...address, [field]: e.target.value })}
            />
          ))}
        </div>

        {/* Payment */}
        <div className="p-4 border rounded space-y-2">
          <h3 className="font-semibold mb-2">Payment Method</h3>
          <select
            className="w-full border rounded px-3 py-2"
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
          >
            <option value="card">Card</option>
            <option value="cash">Cash on Delivery</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 border rounded">
        <h3 className="font-bold mb-4">Order Summary</h3>
        <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Delivery Fee</span><span>${delivery.toFixed(2)}</span></div>
        <div className="flex justify-between mt-3 font-bold"><span>Total</span><span>${total.toFixed(2)}</span></div>
        <button
          onClick={handleCheckout}
          className="mt-4 w-full px-4 py-2 bg-black text-white rounded"
        >
          Confirm Order
        </button>
      </div>
    </div>
  )
}
