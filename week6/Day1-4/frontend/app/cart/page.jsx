'use client'
import React from 'react'
import { useGetCartQuery, useChangeCartQtyMutation, useRemoveFromCartMutation, useCheckoutMutation, useGetProductByIdQuery } from '@/features/api/apiSlice'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { data: cart, isLoading } = useGetCartQuery()
  const [changeQty] = useChangeCartQtyMutation()
  const [removeFromCart] = useRemoveFromCartMutation()
//   const [checkout] = useCheckoutMutation()
  const router = useRouter()

  if (isLoading) return <p className="p-6">Loading cart...</p>
  if (!cart || cart.items.length === 0) {
    return <div className="p-6">Your cart is empty. <Link href="/shop">Shop now</Link></div>
  }

  // utility to display a product title/image: cart.item.productId may be populated object or id
  const ProductPreview = ({ productId }) => {
    const id = productId?._id || productId
    const { data: p } = useGetProductByIdQuery(id, { skip: !id })
    const img = p ? (Object.values(p.imagesByColor || {})[0]?.[0] || null) : null;
    const src = img ? (img.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API_URL || 'http://192.168.18.96:4000'}${img}` : img) : '/placeholder.png'
    return (
      <div className="flex gap-3 items-center">
        <img src={src} className="w-20 h-20 object-cover rounded" alt={p?.name || 'Product'} />
        <div>
          <div className="font-medium">{p?.name || 'Product'}</div>
          <div className="text-sm text-gray-600">{p?.style || ''}</div>
        </div>
      </div>
    )
  }

  const subtotal = cart.items.reduce((s, it) => s + (it.priceAtAdd || 0) * (it.quantity || 0), 0)
  const discount = 0 // if you have promo logic, compute
  const delivery = 15
  const total = subtotal - discount + delivery

  const handleQtyChange = async (productId, qty) => {
    if (qty < 1) return
    try {
      await changeQty({ productId, qty }).unwrap()
      // RTK Query invalidation should update getCart
    } catch (err) {
      console.error(err)
      alert('Failed to update qty')
    }
  }

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId).unwrap()
    } catch (err) {
      console.error(err)
      alert('Failed to remove')
    }
  }


  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <h2 className="text-xl font-bold mb-4">Your Cart</h2>
        <div className="space-y-4">
          {cart.items.map((it) => {
            const pid = it.productId?._id || it.productId
            return (
              <div key={pid} className="flex justify-between items-center border rounded p-4">
                <ProductPreview productId={it.productId} />
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium">${(it.priceAtAdd || 0).toFixed(2)}</div>
                    <div className="text-sm text-gray-500">Qty: {it.quantity}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleQtyChange(pid, it.quantity - 1)} className="px-3 py-1 border rounded">-</button>
                    <div className="px-3">{it.quantity}</div>
                    <button onClick={() => handleQtyChange(pid, it.quantity + 1)} className="px-3 py-1 border rounded">+</button>
                    <button onClick={() => handleRemove(pid)} className="ml-4 text-red-500">🗑</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="p-4 border rounded">
        <h3 className="font-bold mb-4">Order Summary</h3>
        <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Delivery Fee</span><span>${delivery.toFixed(2)}</span></div>
        <div className="flex justify-between mt-3 font-bold"><span>Total</span><span>${total.toFixed(2)}</span></div>
        {/* <button onClick={handleCheckout} className="mt-4 w-full px-4 py-2 bg-black text-white rounded">Order Now</button> */}
        <button
          onClick={() => router.push('/checkout')}
          className="mt-4 w-full px-4 py-2 bg-black text-white rounded"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  )
}
