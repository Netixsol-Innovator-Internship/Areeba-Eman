'use client'
import { useState } from 'react'
import UsersPage from './users/page'
import ProductsPage from './products/page'
import OrdersPage from './orders/page'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('users')

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UsersPage />
      case 'products':
        return <ProductsPage />
      case 'orders':
        return <OrdersPage />
      default:
        return null
    }
  }

  return (
    <div className="flex">
      {/* Left sidebar */}
      <div className="w-1/4 bg-gray-100 p-6 flex flex-col gap-4">
        <button
          onClick={() => setActiveTab('users')}
          className={`p-4 rounded-lg font-medium ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-200'}`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`p-4 rounded-lg font-medium ${activeTab === 'products' ? 'bg-green-600 text-white' : 'bg-white hover:bg-gray-200'}`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`p-4 rounded-lg font-medium ${activeTab === 'orders' ? 'bg-purple-600 text-white' : 'bg-white hover:bg-gray-200'}`}
        >
          Orders
        </button>
      </div>

      {/* Right content */}
      <div className="w-3/4 flex flex-col">
        <div className="p-6 flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
