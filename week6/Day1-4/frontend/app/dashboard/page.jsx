'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
    <div className="flex flex-col">
      {/* Top navigation */}
      <div className="border-b bg-white">
        <div className="flex justify-center space-x-8">
          {['users', 'products', 'orders'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-4 py-3 font-medium transition-colors duration-300 ${
                activeTab === tab
                  ? 'text-black'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && (
                <motion.div
                  layoutId="underline"
                  className="absolute left-0 right-0 -bottom-1 h-[2px] bg-black"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content with animation */}
      <div className="p-6 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
