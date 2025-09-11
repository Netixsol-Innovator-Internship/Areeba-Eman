'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaStar } from 'react-icons/fa'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://easygoing-spontaneity-production.up.railway.app'

export default function ProductCard({ product }) {
  const [loadingImg, setLoadingImg] = useState(true)

  if (!product) {
    return (
      <div className="border rounded-lg overflow-hidden shadow p-4 animate-pulse">
        <div className="w-full aspect-square bg-gray-200 rounded-lg" />
        <div className="mt-4 h-4 bg-gray-200 rounded w-3/4" />
        <div className="mt-2 h-4 bg-gray-200 rounded w-1/2" />
        <div className="mt-4 h-6 bg-gray-200 rounded w-1/3" />
      </div>
    )
  }

  const firstImage = Object.values(product.imagesByColor || {})[0]?.[0]
  console.log("First Image:", firstImage);
  let imageSrc = '/placeholder.png'
  if (firstImage) {
    if (firstImage.startsWith('/uploads')) {

      imageSrc = `${API_URL}${firstImage}`
    } else if (firstImage.startsWith('http')) {
      imageSrc = firstImage
    }
  }

  return (
    <Link href={`/products/${product._id}`} className="block group cursor-pointer">
      <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
        {/* Image wrapper */}
        <div className="relative w-full aspect-square">
          {/* {loadingImg && (
            <div className="absolute inset-0 bg-gray-200" />
          )} */}
          <img
            src={imageSrc}
            alt={product.name || 'Product'}
            // fill
            // sizes="(max-width: 768px) 100vw, 200px"
            className={`object-cover w-full h-full`}
            // onLoadingComplete={() => setLoadingImg(false)}
          />
        </div>

        {/* Product details */}
        <div className="p-4">
          <h3 className="font-semibold text-lg truncate group-hover:underline">
            {product.name}
          </h3>

          <div className="flex items-center text-yellow-500 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar
                key={i}
                className={
                  i < Math.round(product.averageRating || 0)
                    ? 'fill-current'
                    : 'text-gray-300'
                }
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {product.averageRating?.toFixed(1) || '0.0'}
            </span>
          </div>

          <div className="mt-2">
            {product.sale ? (
              <div>
                <span className="text-red-600 font-bold text-lg">
                  ${product.salePrice}
                </span>
                <span className="text-gray-500 line-through ml-2">
                  ${product.price}
                </span>
                <span className="ml-2 text-green-600 font-medium">
                  -{product.discount}%
                </span>
              </div>
            ) : (
              <span className="text-gray-900 font-bold text-lg">
                ${product.price}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

