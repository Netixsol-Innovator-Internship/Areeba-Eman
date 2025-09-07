'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useGetProductByIdQuery, useUpdateProductMutation } from '@/features/api/apiSlice'
import { useState, useEffect } from 'react'

const COLORS = ['red', 'blue', 'black', 'yellow']

export default function EditProductPage() {
  const router = useRouter()
  const params = useSearchParams()
  const id = params.get('id')

  const { data: product, isLoading } = useGetProductByIdQuery(id)
  const [updateProduct] = useUpdateProductMutation()

  const [form, setForm] = useState({
    name: '',
    price: 0,
    sale: false,
    salePrice: 0,
    discount: 0,
    stockQuantity: 0,
    types: '',
    category: '',
    style: '',
    loyaltyPoints: 0,
    size: [],
    imagesByColor: {},
  })

  // Sync product to form when fetched
  useEffect(() => {
    if (product) setForm({ ...product })
  }, [product])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSizeChange = (e) => {
    setForm((prev) => ({ ...prev, size: e.target.value.split(',').map((s) => s.trim()) }))
  }

  const handleFileChange = (color, files) => {
    setForm((prev) => ({
      ...prev,
      imagesByColor: { ...prev.imagesByColor, [color]: [...files] },
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateProduct({ id, ...form }).unwrap()
      alert('Product updated!')
      router.push('/dashboard/products')
    } catch (err) {
      console.error(err)
      alert('Failed to update product')
    }
  }

  if (isLoading) return <p>Loading product...</p>

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 p-4'>
    <form onSubmit={handleSubmit} className="grid gap-4 max-w-4xl p-6 bg-white rounded-xl shadow">
      <label className="font-medium">Name</label>
      <input type="text" name="name" value={form.name || ''} onChange={handleChange} className="border rounded px-3 py-2" />

      <label className="font-medium">Price</label>
      <input type="number" name="price" value={form.price || 0} onChange={handleChange} className="border rounded px-3 py-2" />

      <label className="font-medium">On Sale?</label>
      <input type="checkbox" name="sale" checked={form.sale || false} onChange={handleChange} />

      {form.sale && (
        <>
          <label className="font-medium">Sale Price</label>
          <input type="number" name="salePrice" value={form.salePrice || 0} onChange={handleChange} className="border rounded px-3 py-2" />

          <label className="font-medium">Discount %</label>
          <input type="number" name="discount" value={form.discount || 0} onChange={handleChange} className="border rounded px-3 py-2" />
        </>
      )}

      <label className="font-medium">Stock Quantity</label>
      <input type="number" name="stockQuantity" value={form.stockQuantity || 0} onChange={handleChange} className="border rounded px-3 py-2" />

      <label className="font-medium">Type</label>
      <input type="text" name="types" value={form.types || ''} onChange={handleChange} className="border rounded px-3 py-2" />

      <label className="font-medium">Category</label>
      <input type="text" name="category" value={form.category || ''} onChange={handleChange} className="border rounded px-3 py-2" />

      <label className="font-medium">Style</label>
      <input type="text" name="style" value={form.style || ''} onChange={handleChange} className="border rounded px-3 py-2" />

      <label className="font-medium">Loyalty Points</label>
      <input type="number" name="loyaltyPoints" value={form.loyaltyPoints || 0} onChange={handleChange} className="border rounded px-3 py-2" />

      <label className="font-medium">Sizes (comma separated)</label>
      <input type="text" name="size" value={form.size.join(', ')} onChange={handleSizeChange} className="border rounded px-3 py-2" />

      <div>
        <label className="font-medium mb-1">Images by Color</label>
        {COLORS.map((color) => (
          <div key={color} className="flex flex-col mb-2">
            <span className="text-gray-700">{color}</span>
            <input type="file" multiple onChange={(e) => handleFileChange(color, Array.from(e.target.files))} />
          </div>
        ))}
      </div>

      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        Update Product
      </button>
    </form>
    </div>
  )
}
