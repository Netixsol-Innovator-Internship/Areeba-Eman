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
    window.location.href = '/login';
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
            className="rounded-2xl shadow-lg p-6 bg-gradient-to-br from-green-100 to-green-200 border border-green-300
                       hover:scale-105 transition-transform duration-300 hover:shadow-2xl"
          >
            <h2 className="text-xl font-bold text-green-800">{p.name}</h2>
            <p className="text-sm text-green-700 mt-1">{p.category} — {p.brand}</p>
            {p.description && (
              <p className="text-gray-700 mt-3 line-clamp-3">{p.description}</p>
            )}
            <p className="mt-3 text-lg font-extrabold text-green-900">${p.price}</p>
            <p className="text-sm text-green-700">Stock: {p.stock}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-6 py-4 bg-green-700 shadow-lg rounded-b-2xl">
        <div className="flex items-center gap-3 flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full md:w-2/3 px-4 py-2 rounded-xl border border-green-300 focus:outline-none 
                       focus:ring-2 focus:ring-green-400 shadow-sm"
          />
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 
                       transition-colors shadow-md"
          >
            <Search size={18} /> Search
          </button>
          <button
            onClick={handleAiSearch}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 
                       transition-colors shadow-md"
          >
            <Sparkles size={18} /> AI Search
          </button>
          {(mode === 'search' || mode === 'ai') && (
            <button
              onClick={handleShowAll}
              className="bg-green-300 text-green-900 px-4 py-2 rounded-xl hover:bg-green-400 transition-colors shadow-md"
            >
              Show All
            </button>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 
                     transition-colors shadow-md ml-4"
        >
          <LogOut size={18} /> Logout
        </button>
      </nav>

      {/* CONTENT */}
      <main className="flex-1 p-8">
        {mode === 'all' && (
          <>
            <h1 className="text-3xl font-bold text-green-800 mb-6">🌿 All Products</h1>
            {loadingAll ? <p>Loading...</p> : renderProducts(allProducts)}
          </>
        )}

        {mode === 'search' && (
          <>
            <h1 className="text-3xl font-bold text-green-800 mb-6">🔎 Search Results</h1>
            {loadingSearch ? <p>Searching...</p> : renderProducts(searchedProducts)}
          </>
        )}

        {mode === 'ai' && (
          <>
            <h1 className="text-3xl font-bold text-green-800 mb-2">✨ AI Search Results</h1>
            {loadingAi && <p>Thinking...</p>}
            {aiResult && (
              <>
                <p className="mb-6 text-green-900 italic bg-green-100 p-3 rounded-xl shadow-sm">
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
