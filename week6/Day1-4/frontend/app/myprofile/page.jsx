"use client"
import { useProfileQuery, useGetMyOrdersQuery } from "@/features/api/apiSlice"
import { useState, useEffect } from "react"

export default function MyProfilePage() {
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfileQuery()
  const { data: orders = [], isLoading: ordersLoading, isError: ordersError } = useGetMyOrdersQuery()
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    setNotifications([
      { id: 1, message: "Your order #123 has been shipped!" },
      { id: 2, message: "You earned 50 loyalty points." },
    ])
  }, [])

  if (profileLoading || ordersLoading)
    return <div className="p-6 text-center text-gray-500">Loading...</div>
  if (profileError)
    return <div className="p-6 text-red-500 text-center">Error loading profile</div>
  if (ordersError)
    return <div className="p-6 text-red-500 text-center">Error loading orders</div>

  // helper to color status badge
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
{/* trying */}
      {/* Profile Banner */}
      <div className="relative bg-gradient-to-r from-blue-300 to-pink-800 rounded-2xl shadow-lg text-white p-8">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
            {profile?.fullName?.[0] || "U"}
          </div>
          <div>
            <h1 className="text-3xl font-semibold">{profile?.fullName}</h1>
            <p className="text-blue-100">{profile?.email}</p>
            <p className="mt-2 text-sm">
              Member since{" "}
              <span className="font-medium">
                {new Date(profile?.createdAt).toLocaleDateString()}
              </span>
            </p>
          </div>
        </div>
        <div className="absolute top-6 right-6 bg-white text-blue-600 font-semibold px-4 py-2 rounded-full shadow">
          ⭐ {profile?.loyaltyPoints ?? 0} Points
        </div>
      </div>

      {/* Orders */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
        {Array.isArray(orders) && orders.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-6">
            {orders.map(order => (
            <div
                key={order._id}
                className="bg-white rounded-xl shadow p-4 border border-gray-100 hover:shadow-md transition"
            >
                <div className="flex items-center justify-between">
                <p className="font-medium">
                    Order #{order._id?.slice(-6)}
                </p>
                <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}
                >
                    {order.status || "Unknown"}
                </span>
                </div>

                <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
                </p>

                <p className="text-lg font-bold mt-2">${order.total?.toFixed(2)}</p>

                <div className="mt-2 text-sm text-gray-700">
                <p>{order.items?.length} item{order.items?.length !== 1 && "s"}:</p>
                <ul className="list-disc list-inside">
                    {order.items?.map((it, i) => (
                    <li key={i}>
                        {it.name} × {it.quantity}
                    </li>
                    ))}
                </ul>
                </div>
            </div>
            ))}
             </div>
        ) : (
          <p className="text-gray-500">No orders yet.</p>
        )}
      </div>

      {/* Notifications */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications</p>
        ) : (
          <div className="space-y-3">
            {notifications.map(n => (
              <div
                key={n.id}
                className="bg-white p-4 rounded-xl shadow flex items-center gap-3 hover:bg-gray-50 transition"
              >
                <span className="text-blue-500 text-xl">🔔</span>
                <p>{n.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
