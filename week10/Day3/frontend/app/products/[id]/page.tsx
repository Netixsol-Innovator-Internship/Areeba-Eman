'use client';

import { useParams } from 'next/navigation';
import { useGetProductByIdQuery } from '../../../features/products/productsApi';
import ChatWidget from '@/components/ChatWidget';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { data: product, isLoading } = useGetProductByIdQuery(id as string);

  if (isLoading) return <p className="p-8">Loading product...</p>;
  if (!product) return <p className="p-8">Product not found.</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
        <p className="text-gray-700 mt-2">{product.category} — {product.brand}</p>
        <p className="mt-4 text-xl font-semibold text-gray-800">${product.price}</p>

        {product.description && (
          <p className="mt-6 text-gray-600 leading-relaxed">{product.description}</p>
        )}

        <p className="mt-4 text-sm text-gray-500">Stock: {product.stock}</p>
      </div>
      <div className="fixed bottom-6 right-6">
              <ChatWidget />
            </div>
    </div>
  );
}
