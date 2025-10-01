'use client';

import { useState } from 'react';
import {
  useGetProductsQuery,
  useSearchProductsQuery,
  useAiSearchMutation,
  Product,
} from '../../features/products/productsApi';
import ChatWidget from '@/components/ChatWidget';
import { LogOut, Search, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ProductsPage() {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'all' | 'search' | 'ai'>('all');
  const [aiResult, setAiResult] = useState<null | {
    query: string;
    keywords: string[];
    products: Product[];
    explanation: string;
  }>(null);

  const { data: allProducts, isLoading: loadingAll } = useGetProductsQuery(undefined, {
    skip: mode !== 'all',
  });

  const { data: searchedProducts, isLoading: loadingSearch } = useSearchProductsQuery(query, {
    skip: mode !== 'search' || query.trim() === '',
  });

  const [aiSearch, { isLoading: loadingAi }] = useAiSearchMutation();

  const handleSearch = () => {
    setMode('search');
    setAiResult(null);
  };

  const handleAiSearch = async () => {
    try {
      setMode('ai');
      const res = await aiSearch(query).unwrap();
      setAiResult(res);
    } catch (err) {
      alert('AI search failed');
    }
  };

  const handleShowAll = () => {
    setQuery('');
    setAiResult(null);
    setMode('all');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const renderProducts = (products: Product[] | undefined) => {
    if (!products || products.length === 0) {
      return <p className="text-gray-500 text-center mt-6">No products found.</p>;
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {products.map((p) => (
          <div
            key={p._id}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold text-gray-800">{p.name}</h2>
            <p className="text-sm text-gray-600 mt-1">{p.category} — {p.brand}</p>
            <p className="mt-3 text-base font-bold text-gray-900">${p.price}</p>
            
            <Link
              href={`/products/${p._id}`}
              className="inline-block mt-4 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              See Details
            </Link>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm">
        <div className="flex items-center gap-3 flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full md:w-2/3 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none 
                       focus:ring-2 focus:ring-blue-400 shadow-sm"
          />
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 
                       transition-colors shadow-sm"
          >
            <Search size={18} /> Search
          </button>
          <button
            onClick={handleAiSearch}
            className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 
                       transition-colors shadow-sm"
          >
            <Sparkles size={18} /> AI Search
          </button>
          {(mode === 'search' || mode === 'ai') && (
            <button
              onClick={handleShowAll}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors shadow-sm"
            >
              Show All
            </button>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 
                     transition-colors shadow-sm ml-4"
        >
          <LogOut size={18} /> Logout
        </button>
      </nav>

      {/* CONTENT */}
      <main className="flex-1 p-8">
        {mode === 'all' && (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">All Products</h1>
            {loadingAll ? <p>Loading...</p> : renderProducts(allProducts)}
          </>
        )}

        {mode === 'search' && (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Search Results</h1>
            {loadingSearch ? <p>Searching...</p> : renderProducts(searchedProducts)}
          </>
        )}

        {mode === 'ai' && (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">AI Search Results</h1>
            {loadingAi && <p>Thinking...</p>}
            {aiResult && (
              <>
                <p className="mb-6 text-gray-700 italic bg-gray-100 p-3 rounded-lg shadow-sm">
                  {aiResult.explanation}
                </p>
                {renderProducts(aiResult.products)}
              </>
            )}
          </>
        )}
      </main>

      {/* Floating Chat Widget */}
      <div className="fixed bottom-6 right-6">
        <ChatWidget />
      </div>
    </div>
  );
}
