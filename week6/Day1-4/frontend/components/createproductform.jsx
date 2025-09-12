'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateProductMutation } from '@/features/api/apiSlice'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function CreateProductForm() {
  const [form, setForm] = useState({
    name: '',
    price: 0,
    types: 'shirts',
    stockQuantity: 0,
    category: 'male',
    style: 'casual',
    size: [],
    loyaltyPoints: 0,
    pointsPrice: 0,
  })
  const [images, setImages] = useState({}) // { color: [File, ...] }
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [createProduct] = useCreateProductMutation()

  const colors = ['red', 'blue', 'black', 'yellow']

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (color, files) => {
    setImages((prev) => ({ ...prev, [color]: Array.from(files) }))
  }

  const handleCreateProduct = async () => {
    try {
      const newProduct = await createProduct(form).unwrap()
      return newProduct._id
    } catch (err) {
      console.error(err)
      alert('Failed to create product')
      return null
    }
  }
  const token = localStorage.getItem('token');
    const handleUploadImages = async (productId) => {
  try {
    for (const color of colors) {
      if (!images[color] || images[color].length === 0) continue;
      const formData = new FormData();
      images[color].forEach((file) => formData.append('images', file));

      await fetch(`${API_URL}/products/${productId}/images/${color}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
    }
  } catch (err) {
    console.error(err);
    alert('Failed to upload images');
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const productId = await handleCreateProduct()
    if (productId) {
      await handleUploadImages(productId)
      alert('Product created successfully!')
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 max-w-xl mx-auto p-4 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Create New Product</h2>

      <div>
        <label className="block mb-1 font-medium">Product Name</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" required />
      </div>

      <div>
        <label className="block mb-1 font-medium">Price</label>
        <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full border p-2 rounded" required />
      </div>

      <div>
        <label className="block mb-1 font-medium">Type</label>
        <select name="types" value={form.types} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="shirts">Shirts</option>
          <option value="tshirts">T-Shirts</option>
          <option value="jeans">Jeans</option>
          <option value="hoodies">Hoodies</option>
          <option value="shorts">Shorts</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Stock Quantity</label>
        <input type="number" name="stockQuantity" value={form.stockQuantity} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block mb-1 font-medium">Category</label>
        <select name="category" value={form.category} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Style</label>
        <select name="style" value={form.style} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="casual">Casual</option>
          <option value="formal">Formal</option>
          <option value="party">Party</option>
          <option value="gym">Gym</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Sizes (comma separated)</label>
        <input type="text" name="size" value={form.size} onChange={handleChange} className="w-full border p-2 rounded" placeholder="S,M,L,XL" />
      </div>

      <div>
        <label className="block mb-1 font-medium">Loyalty Points</label>
        <input type="number" name="loyaltyPoints" value={form.loyaltyPoints} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block mb-1 font-medium">Points Price</label>
        <input type="number" name="pointsPrice" value={form.pointsPrice} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block mb-2 font-medium">Upload Images per Color</label>
        {colors.map((color) => (
          <div key={color} className="mb-2">
            <p className="font-medium">{color}</p>
            <input type="file" multiple onChange={(e) => handleFileChange(color, e.target.files)} />
          </div>
        ))}
      </div>

      <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        {loading ? 'Creating...' : 'Create Product'}
      </button>
    </form>
  )
}
