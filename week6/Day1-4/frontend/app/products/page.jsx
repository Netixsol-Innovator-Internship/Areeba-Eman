'use client'
import { Suspense } from 'react'
import ProductsContent from './ProductsContent'

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading filters...</div>}>
      <ProductsContent/>
    </Suspense>
  )
}
