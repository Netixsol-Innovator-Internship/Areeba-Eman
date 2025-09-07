'use client'
import { useSearchParams } from 'next/navigation'
import { useGetProductsQuery } from '@/features/api/apiSlice'
import ProductCard from '@/components/ProductCard'
import FiltersSidebar from '@/components/FiltersSidebar'

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const query = Object.fromEntries(searchParams.entries())

  const { data: products = [], isLoading } = useGetProductsQuery(query)

  return (
    <main className="px-4 py-8 flex gap-8">
      {/* Sidebar */}
      <FiltersSidebar />

      {/* Products Grid */}
      <div className="flex-1">
        <h1 className="text-3xl font-extrabold mb-6 capitalize">
          {query.style ? `${query.style} Products` : 'All Products'}
        </h1>

        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
