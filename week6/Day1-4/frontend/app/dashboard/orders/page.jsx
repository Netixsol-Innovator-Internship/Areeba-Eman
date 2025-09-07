'use client'
import { useState } from 'react'
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '@/features/api/apiSlice'

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const { data: orders = [], isLoading, refetch } = useGetOrdersQuery({ status: statusFilter })
  const [updateStatus] = useUpdateOrderStatusMutation()

  if (isLoading) return <p className="p-6">Loading orders...</p>

  const handleSaveStatus = async () => {
    if (!newStatus) return alert('Select a status')
    try {
      await updateStatus({ orderId: selectedOrder._id, status: newStatus }).unwrap()
      alert('Status updated!')
      setSelectedOrder({ ...selectedOrder, status: newStatus })
      refetch()
    } catch (err) {
      console.error(err)
      alert('Failed to update status')
    }
  }

  if (selectedOrder) {
    return (
      <div className="p-6">
        <button
          className="mb-4 px-4 py-2 bg-gray-300 rounded"
          onClick={() => setSelectedOrder(null)}
        >
          Back to Orders
        </button>

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Order ID: {selectedOrder._id}</h1>
          <div className="flex gap-2 items-center">
            <select
              className="border p-2 rounded"
              value={newStatus || selectedOrder.status}
              onChange={(e) => setNewStatus(e.target.value)}
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

        <p className="mb-6">Date: {new Date(selectedOrder.createdAt).toLocaleString()}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Customer Details */}
          <div className="p-4 border rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Customer</h3>
            <p><strong>Full Name:</strong> {selectedOrder.userId?.fullName || 'N/A'}</p>
            <p><strong>Email:</strong> {selectedOrder.userId?.email || '-'}</p>
            <p><strong>Loyalty Points:</strong> {selectedOrder.userId?.loyaltyPoints ?? 0}</p>
          </div>


          {/* Order Details */}
          <div className="p-4 border rounded">
            <h2 className="font-bold mb-2">Order Info</h2>
            <p>Status: {selectedOrder.status}</p>
            <p>Payment Method: {selectedOrder.paymentInfo?.method || '-'}</p>
            <p>Subtotal: ${selectedOrder.subtotal.toFixed(2)}</p>
            <p>Discount: ${selectedOrder.discount.toFixed(2)}</p>
            <p>Shipping: ${selectedOrder.deliveryCharges.toFixed(2)}</p>
            <p>Total: ${selectedOrder.total.toFixed(2)}</p>
          </div>

          {/* Shipping Address */}
          <div className="p-4 border rounded">
            <h2 className="font-bold mb-2">Shipping Address</h2>
            <p>{selectedOrder.addressInfo?.street}</p>
            <p>{selectedOrder.addressInfo?.city}, {selectedOrder.addressInfo?.state}</p>
            <p>{selectedOrder.addressInfo?.zip}, {selectedOrder.addressInfo?.country}</p>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Product Name</th>
                <th className="border p-2">Product ID</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrder.items.map((item) => (
                <tr key={item.productId}>
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">{item.productId}</td>
                  <td className="border p-2">{item.quantity}</td>
                  <td className="border p-2">${item.lineTotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Recent Orders</h1>
        <select
          className="border p-2 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="delivered">Delivered</option>
          <option value="completed">Completed</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Order ID</th>
            <th className="border p-2">Products</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Customer Name</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order._id}
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => setSelectedOrder(order)}
            >
              <td className="border p-2">{order._id}</td>
              <td className="border p-2">{order.items.map(i => i.name).join(', ')}</td>
              <td className="border p-2">{new Date(order.createdAt).toLocaleDateString()}</td>
              <td className="border p-2">{order.userId?.fullName || 'N/A'}</td>
              <td className="border p-2">{order.status}</td>
              <td className="border p-2">${order.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
