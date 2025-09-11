'use client'
import { useState } from 'react'
import { useGetProductsQuery } from '@/features/api/apiSlice'
import ProductCard from '@/components/productCard'
import Hero from '@/components/Hero'
import { ChevronDown, ChevronUp } from 'lucide-react'
import BrowseCard from '@/components/BrowseCard'
import ReviewsSlider from '@/components/ReviewSlider'

export default function HomePage() {
  const { data: products = [], isLoading } = useGetProductsQuery()
  const [showAll, setShowAll] = useState(false)

  // Decide how many products to show
  const visibleProducts = showAll ? products : products.slice(0, 4)

  return (
    <main>
      <Hero />
      <h1 className="text-4xl font-extrabold text-center mt-8 mb-6">New Arrivals</h1>

      <div className="px-4 py-8">
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <ProductCard key={i} product={null} />
              ))
            : visibleProducts.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>

        {/* Show More / Show Less button */}
        {!isLoading && products.length > 4 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2 px-6 py-2 rounded-3xl border border-black text-black hover:bg-gray-300 transition"
            >
              {showAll ? (
                <>
                  Show Less <ChevronUp size={18} />
                </>
              ) : (
                <>
                  Show More <ChevronDown size={18} />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <BrowseCard />

      <h1 className="text-3xl font-extrabold text-center mt-8 mb-6">Our Happy Customers</h1>
      <ReviewsSlider />

    </main>
  )
}
