// 'use client'
// import { useState, useEffect } from 'react'
// import { useParams } from 'next/navigation'
// import { useGetOrderByIdQuery, useUpdateOrderStatusMutation } from '@/features/api/apiSlice'

// export default function OrderDetailsPage() {
//   const params = useParams()
//   const orderId = params.orderId
//   const { data: order, isLoading } = useGetOrderByIdQuery(orderId)
//   const [status, setStatus] = useState('')
//   const [updateStatus] = useUpdateOrderStatusMutation()

//   useEffect(() => {
//     if (order) setStatus(order.status)
//   }, [order])

//   const handleSaveStatus = async () => {
//     await updateStatus({ orderId, status })
//     alert('Status updated!')
//   }

//   if (isLoading) return <p>Loading order...</p>

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h2 className="text-xl font-bold">Order {order._id}</h2>
//           <p>{new Date(order.createdAt).toLocaleString()}</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <select
//             value={status}
//             onChange={(e) => setStatus(e.target.value)}
//             className="border p-2 rounded"
//           >
//             <option value="active">Active</option>
//             <option value="delivered">Delivered</option>
//             <option value="completed">Completed</option>
//             <option value="canceled">Canceled</option>
//           </select>
//           <button onClick={handleSaveStatus} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
//         </div>
//       </div>

//       {/* Info Columns */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="p-4 border rounded">
//           <h3 className="font-bold mb-2">Customer Details</h3>
//           <p>Name: {order.customerName}</p>
//           <p>Email: {order.customerEmail}</p>
//         </div>

//         <div className="p-4 border rounded">
//           <h3 className="font-bold mb-2">Order Details</h3>
//           <p>Shipping: {order.shippingMethod}</p>
//           <p>Payment: {order.paymentInfo.method}</p>
//           <p>Status: {order.status}</p>
//         </div>

//         <div className="p-4 border rounded">
//           <h3 className="font-bold mb-2">Deliver To</h3>
//           <p>{order.addressInfo.street}</p>
//           <p>{order.addressInfo.city}, {order.addressInfo.state} {order.addressInfo.zip}</p>
//           <p>{order.addressInfo.country}</p>
//         </div>
//       </div>

//       {/* Payment Card */}
//       <div className="p-4 border rounded">
//         <h3 className="font-bold mb-2">Card Details</h3>
//         <p>Type: {order.paymentInfo.cardType}</p>
//         <p>Number: **** **** **** {order.paymentInfo.cardLast4}</p>
//         <p>Expiry: {order.paymentInfo.expiry}</p>
//       </div>

//       {/* Products Table */}
//       <table className="w-full border-collapse border">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border p-2">Product Name</th>
//             <th className="border p-2">Product ID</th>
//             <th className="border p-2">Quantity</th>
//             <th className="border p-2">Line Total</th>
//           </tr>
//         </thead>
//         <tbody>
//           {order.items.map(item => (
//             <tr key={item.productId}>
//               <td className="border p-2">{item.name}</td>
//               <td className="border p-2">{item.productId}</td>
//               <td className="border p-2">{item.quantity}</td>
//               <td className="border p-2">${item.lineTotal.toFixed(2)}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Footer Totals */}
//       <div className="text-right space-y-1">
//         <p>Subtotal: ${order.subtotal.toFixed(2)}</p>
//         <p>Discount: ${order.discount.toFixed(2)}</p>
//         <p>Shipping: ${order.deliveryCharges.toFixed(2)}</p>
//         <p className="font-bold">Total: ${order.total.toFixed(2)}</p>
//       </div>
//     </div>
//   )
// }
// 'use client'
// import { useGetOrderByIdQuery } from '@/features/api/apiSlice'

// export default function OrderDetails({ orderId, onBack }) {
//   const { data: order, isLoading } = useGetOrderByIdQuery(orderId)

//   if (isLoading) return <p>Loading...</p>
//   if (!order) return <p>Order not found</p>

//   return (
//     <div>
//       <button onClick={onBack} className="mb-4 px-4 py-2 bg-gray-300 rounded">Back</button>
//       <h2>Order ID: {order._id}</h2>
//       <p>Date: {new Date(order.createdAt).toLocaleString()}</p>

//       {/* You can now build your 3 divs row: customer, order info, address */}
//       {/* Then table of products, subtotal, discount, shipping, total */}
//     </div>
//   )
// }

'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useGetOrderByIdQuery, useUpdateOrderStatusMutation } from '@/features/api/apiSlice'

export default function OrderDetailsPage() {
  const { orderId } = useParams()
  const { data: order, isLoading } = useGetOrderByIdQuery(orderId)
  const [status, setStatus] = useState('')
  const [updateStatus] = useUpdateOrderStatusMutation()

  useEffect(() => {
    if (order) setStatus(order.status)
  }, [order])

  const handleSaveStatus = async () => {
    await updateStatus({ orderId, status })
    alert('Status updated!')
  }

  if (isLoading) return <p>Loading order...</p>
  if (!order) return <p>Order not found</p>

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Order {order._id}</h2>
          <p>{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="active">Active</option>
            <option value="delivered">Delivered</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </select>
          <button
            onClick={handleSaveStatus}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>

      {/* Info Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 border rounded">
          <h3 className="font-bold mb-2">Customer Details</h3>
          <p>Name: {order.customerName}</p>
          <p>Email: {order.customerEmail}</p>
        </div>

        <div className="p-4 border rounded">
          <h3 className="font-bold mb-2">Order Details</h3>
          <p>Shipping: {order.shippingMethod}</p>
          <p>Payment: {order.paymentInfo.method}</p>
          <p>Status: {order.status}</p>
        </div>

        <div className="p-4 border rounded">
          <h3 className="font-bold mb-2">Deliver To</h3>
          <p>{order.addressInfo.street}</p>
          <p>{order.addressInfo.city}, {order.addressInfo.state} {order.addressInfo.zip}</p>
          <p>{order.addressInfo.country}</p>
        </div>
      </div>

      {/* Payment Card */}
      <div className="p-4 border rounded">
        <h3 className="font-bold mb-2">Card Details</h3>
        <p>Type: {order.paymentInfo.cardType}</p>
        <p>Number: **** **** **** {order.paymentInfo.cardLast4}</p>
        <p>Expiry: {order.paymentInfo.expiry}</p>
      </div>

      {/* Products Table */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Product Name</th>
            <th className="border p-2">Product ID</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Line Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map(item => (
            <tr key={item.productId}>
              <td className="border p-2">{item.name}</td>
              <td className="border p-2">{item.productId}</td>
              <td className="border p-2">{item.quantity}</td>
              <td className="border p-2">${item.lineTotal.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer Totals */}
      <div className="text-right space-y-1">
        <p>Subtotal: ${order.subtotal.toFixed(2)}</p>
        <p>Discount: ${order.discount.toFixed(2)}</p>
        <p>Shipping: ${order.deliveryCharges.toFixed(2)}</p>
        <p className="font-bold">Total: ${order.total.toFixed(2)}</p>
      </div>
    </div>
  )
}
