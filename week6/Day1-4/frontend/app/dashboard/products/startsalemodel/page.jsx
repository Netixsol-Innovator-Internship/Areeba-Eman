'use client'

import { useState } from 'react'
import { useSetProductSaleMutation } from '@/features/api/apiSlice'

function StartSaleModal({ products, onClose }) {
  const [selectedProduct, setSelectedProduct] = useState('')
  const [discount, setDiscount] = useState(0)
  const [saleEnd, setSaleEnd] = useState('')
  const [setProductSale] = useSetProductSaleMutation()

const handleStartSale = async () => {
  if (!selectedProduct) return alert('Select a product')

  const payload = {
    sale: true,
    discount: Number(discount)
  }
  if (saleEnd) payload.saleEnd = new Date(saleEnd).toISOString() // convert to ISO string

  try {
    const result = await setProductSale({ id: selectedProduct, body: payload }).unwrap()
    console.log('Sale started:', result)
    alert('Sale started!')
    onClose()
  } catch (err) {
    console.error('Failed to start sale:', err)
    alert('Failed to start sale: ' + JSON.stringify(err.data || err))
  }
}




  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Start Live Sale</h2>
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="w-full mb-2 border p-2"
        >
          <option value="">Select Product</option>
          {products.filter(p => !p.sale).map(p => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Discount %"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          className="w-full mb-2 border p-2"
        />
        <input
          type="datetime-local"
          value={saleEnd}
          onChange={(e) => setSaleEnd(e.target.value)}
          className="w-full mb-4 border p-2"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button onClick={handleStartSale} className="px-4 py-2 bg-blue-600 text-white rounded">Start Sale</button>
        </div>
      </div>
    </div>
  )
}

export default StartSaleModal ;