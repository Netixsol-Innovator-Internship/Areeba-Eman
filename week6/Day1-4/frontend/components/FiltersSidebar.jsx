'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const categories = ['T-shirts', 'Shorts', 'Shirts', 'Hoodies', 'Jeans']
const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL']
const dressStyles = ['casual', 'formal', 'party', 'gym']
const colors = ['black', 'white', 'red', 'green', 'blue', 'purple', 'orange', 'pink']

export default function FiltersSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // controlled states
  const [type, setType] = useState(searchParams.get('type') || '')
  const [style, setStyle] = useState(searchParams.get('style') || '')
  const [size, setSize] = useState(searchParams.get('size') || '')
  const [color, setColor] = useState(searchParams.get('color') || '')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || 0)
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || 5000)

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (type) params.set('types', type)
    if (style) params.set('style', style)
    if (size) params.set('size', size)
    if (color) params.set('color', color)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)

    router.push(`/products?${params.toString()}`)
  }

  return (
    <aside className="w-64 bg-white rounded-lg p-4 shadow">
      <h3 className="font-bold mb-4">Filters</h3>

      {/* Types */}
      <div className="mb-4">
        <p className="font-medium mb-2">Types</p>
        <div className="flex flex-col gap-2">
          {categories.map(c => (
            <label key={c} className="flex items-center gap-2">
              <input
                type="radio"
                name="type"
                checked={type === c}
                onChange={() => setType(c)}
              />
              {c}
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="mb-4">
        <p className="font-medium mb-2">Price</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            className="w-16 border rounded p-1"
          />
          -
          <input
            type="number"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            className="w-16 border rounded p-1"
          />
        </div>
      </div>

      {/* Colors */}
      <div className="mb-4">
        <p className="font-medium mb-2">Colors</p>
        <div className="flex flex-wrap gap-2">
          {colors.map(c => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-6 h-6 rounded-full border-2 ${color === c ? 'border-black' : 'border-gray-300'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Size */}
      <div className="mb-4">
        <p className="font-medium mb-2">Size</p>
        <div className="flex flex-wrap gap-2">
          {sizes.map(s => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`px-2 py-1 border rounded ${size === s ? 'bg-black text-white' : 'bg-gray-100'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Dress Style */}
      <div className="mb-4">
        <p className="font-medium mb-2">Dress Style</p>
        <div className="flex flex-col gap-2">
          {dressStyles.map(d => (
            <label key={d} className="flex items-center gap-2 capitalize">
              <input
                type="radio"
                name="style"
                checked={style === d}
                onChange={() => setStyle(d)}
              />
              {d}
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={applyFilters}
        className="w-full bg-black text-white py-2 rounded mt-4 hover:bg-gray-800 transition"
      >
        Apply Filters
      </button>
    </aside>
  )
}
