'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useGetProductsQuery, useCreateProductMutation, useSetProductSaleMutation } from '@/features/api/apiSlice'
import { FaStar } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import StartSaleModal from './startsalemodel/page.jsx'
import CreateProductForm from '@/components/createproductform.jsx'


const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function ProductsPage() {
  const { data: products = [], isLoading } = useGetProductsQuery()
  const [createProduct] = useCreateProductMutation()
  const [setProductSale] = useSetProductSaleMutation()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState('all')
  const [productList, setProductList] = useState([])

  // sync products
  useEffect(() => setProductList(products), [products])

  // Helper to get first image
  const getFirstImage = (product) => {
    const firstImage = Object.values(product.imagesByColor || {})[0]?.[0]
    if (!firstImage) return '/placeholder.png'
    return firstImage.startsWith('/uploads') ? `${API_URL}${firstImage}` : firstImage
  }

   const [showSaleModal, setShowSaleModal] = useState(false)


// Render product card
const ProductCard = ({ product }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
      <div className="relative w-full h-48 mb-2">
        <img
          src={getFirstImage(product)}
          alt={product.name}
          fill
          // sizes="(max-width: 100px) 10vw, 90px"
          className="object-cover rounded-lg w-full h-full"
          // onLoad={() => console.log(`${product.name} image loaded`)} // <-- updated from onLoadingComplete
        />
      </div>
      <h2 className="text-xl font-bold">{product.name}</h2>
      <p><strong>Price:</strong> ${product.sale ? product.salePrice : product.price}</p>
      {product.sale && <p className="text-green-600 font-medium">On Sale - {product.discount}% off</p>}
      <p><strong>Stock:</strong> {product.stockQuantity}</p>
      <p><strong>Type:</strong> {product.types}</p>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Style:</strong> {product.style}</p>
      <p><strong>Loyalty Points:</strong> {product.loyaltyPoints}</p>
      <p><strong>Sizes:</strong> {product.size.join(', ')}</p>
      <p><strong>Colors:</strong> {Object.keys(product.imagesByColor || {}).join(', ')}</p>
      <div className="flex items-center text-yellow-500">
        {Array.from({ length: 5 }).map((_, i) => (
          <FaStar
            key={i}
            className={i < Math.round(product.averageRating || 0) ? 'fill-current' : 'text-gray-300'}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">{product.averageRating?.toFixed(1) || '0.0'}</span>
      </div>
      <button
        className="mt-2 px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
        onClick={() => router.push(`/dashboard/products/edit/${product._id}`)}
      >
        Edit
      </button>
    </div>
  )
}


  if (isLoading) return <p>Loading products...</p>

return (
  <div className="flex flex-col h-full">
    {/* Tabs */}
    <div className="flex gap-4 mb-4 flex-shrink-0">
      <button
        className={`px-4 py-2 rounded ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        onClick={() => setActiveTab('all')}
      >
        All Products
      </button>
      <button
        className={`px-4 py-2 rounded ${activeTab === 'create' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        onClick={() => setActiveTab('create')}
      >
        Create Product
      </button>
      <button
        className={`px-4 py-2 rounded ${activeTab === 'sale' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        onClick={() => setActiveTab('sale')}
      >
        Live Sale
      </button>
    </div>

    {/* Tab content container: takes remaining height and scrolls */}
    <div className="flex-1 overflow-y-auto">
      {activeTab === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {productList.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}

      {activeTab === 'create' && (
        <div>
          <CreateProductForm createProduct={createProduct} />
        </div>
      )}

      {activeTab === 'sale' && (
        <div>
          <button
            className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
            onClick={() => setShowSaleModal(true)}
          >
            Start Live Sale
          </button>

          {/* Modal */}
          {showSaleModal && (
            <StartSaleModal
              products={productList.filter(p => !p.sale)}
              onClose={() => setShowSaleModal(false)}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {productList
              .filter(p => !p.sale)
              .map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
          </div>
        </div>
      )}
    </div>
  </div>
)

}
