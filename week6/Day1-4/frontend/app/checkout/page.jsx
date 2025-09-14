'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useGetCartQuery, useGetProductByIdQuery, useCheckoutMutation, useConfirmOrderPaymentMutation} from '@/features/api/apiSlice'

export default function CheckoutPage() {
  const { data: cart, isLoading: cartLoading } = useGetCartQuery()
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [checkout, { isLoading: isCheckout }] = useCheckoutMutation()
  const [confirmOrderPayment] = useConfirmOrderPaymentMutation()

  const [address, setAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    country: '',
    postalCode: ''
  })
  const [usePoints, setUsePoints] = useState(false)
  const [method, setMethod] = useState('card')

  const subtotal = cart?.items?.reduce((s, it) => s + (it.priceAtAdd || 0) * (it.quantity || 0), 0) || 0
  const discount = 0
  const delivery = 15
  const total = subtotal - discount + delivery

  const ProductPreview = ({ productId }) => {
    const id = productId?._id || productId
    const { data: p } = useGetProductByIdQuery(id, { skip: !id })
    const img = p ? (Object.values(p.imagesByColor || {})[0]?.[0] || null) : null
    const src = img ? (img.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API_URL}${img}` : img) : '/placeholder.png'
    return (
      <div className="flex gap-3 items-center">
        <img src={src} className="w-16 h-16 object-cover rounded" alt={p?.name || 'Product'} />
        <div>
          <div className="font-medium">{p?.name || 'Product'}</div>
          <div className="text-sm text-gray-600">{p?.style || ''}</div>
        </div>
      </div>
    )
  }

  if (cartLoading) return <p className="p-6">Loading checkout...</p>
  if (!cart || cart.items.length === 0) return <div className="p-6 text-center">Your cart is empty.</div>

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // 1️⃣ Create order and get clientSecret
      const orderBody = {
        addressInfo: address,
        paymentInfo: { method },
        usePoints
      }
      const orderRes = await checkout(orderBody).unwrap()
      console.log('orderRes:', orderRes) 
      const orderId = orderRes.orderId
      const clientSecret = orderRes.clientSecret

      if (method === 'card') {
        if (!clientSecret) throw new Error('No clientSecret returned from backend')

        const card = elements.getElement(CardElement)
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card, billing_details: { name: address.fullName } }
        })

        if (error || paymentIntent.status !== 'succeeded') {
        await confirmOrderPayment({ orderId, paymentInfo: { status: 'failed' } });
        router.push('/checkout/failed');
      } else {
        await confirmOrderPayment({ orderId, paymentInfo: { status: 'succeeded' } });
        router.push(`/checkout/success?order=${orderId}`);
      }

      } else {
        // Points or COD → mark as paid
        router.push(`/checkout/success?order=${orderId}`)
      }
    } catch (err) {
      console.error(err)
      router.push('/checkout/failed')
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 max-w-6xl mx-auto">
      {/* Left: address & payment */}
      <div className="md:col-span-2">
        <h1 className="text-2xl font-bold mb-6 text-center">Checkout</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">

          <div>
            <label className="block font-semibold mb-1">Full Name</label>
            <input
              type="text"
              value={address.fullName}
              onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Street Address</label>
            <input
              type="text"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">City</label>
              <input
                type="text"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Postal Code</label>
              <input
                type="text"
                value={address.postalCode}
                onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Country</label>
            <input
              type="text"
              value={address.country}
              onChange={(e) => setAddress({ ...address, country: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" checked={usePoints} onChange={(e) => setUsePoints(e.target.checked)} />
            <span>Use Loyalty Points</span>
          </div>

          <div>
            <label className="block font-semibold mb-1">Payment Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="card">Credit Card</option>
              <option value="points">Loyalty Points</option>
              <option value="cod">Cash on Delivery</option>
            </select>
          </div>

          {method === 'card' && (
            <div>
              <label className="block font-semibold mb-1">Card Details</label>
              <div className="border rounded px-3 py-2">
                <CardElement />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isCheckout}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
          >
            {isCheckout ? 'Processing...' : 'Place Order'}
          </button>
        </form>
      </div>

      {/* Right: cart summary */}
      <div className="border rounded p-4 bg-white shadow">
        <h2 className="text-xl font-bold mb-4">Your Items</h2>
        <div className="space-y-3 mb-4">
          {cart.items.map((it) => (
            <div key={it._id} className="flex justify-between items-center">
              <ProductPreview productId={it.productId} />
              <div className="text-right">
                <div className="font-medium">${(it.priceAtAdd || 0).toFixed(2)}</div>
                <div className="text-sm text-gray-500">Qty: {it.quantity}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 space-y-1">
          <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Delivery</span><span>${delivery.toFixed(2)}</span></div>
          <div className="flex justify-between font-bold text-lg pt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  )
}
