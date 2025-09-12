'use client'
import { useParams } from 'next/navigation'
import { useGetProductByIdQuery, useAddToCartMutation, useChangeCartQtyMutation, useGetCartQuery } from '@/features/api/apiSlice'
import ReviewsGridAndForm from '@/components/ReviewsGridAndForm'
import { socket } from '@/lib/socket'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { data: product, isLoading } = useGetProductByIdQuery(id)
  const [addToCart] = useAddToCartMutation()
  const [changeQty] = useChangeCartQtyMutation()
  const { data: cart } = useGetCartQuery(undefined, { skip: false }) // will skip internally if unauthorized
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [qty, setQty] = useState(1)
  const [mainImage, setMainImage] = useState(null)
  const [liveStock, setLiveStock] = useState(0)

  useEffect(() => {
    if (product) {
      setLiveStock(product.stockQuantity ?? 0)
      // select default color/size
      const colors = Object.keys(product.imagesByColor || {})
      setSelectedColor(colors[0] ?? null)
      setSelectedSize(product.size?.[0] ?? null)
      const firstImage = Object.values(product.imagesByColor || {})[0]?.[0]
      setMainImage(firstImage ? (firstImage.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API_URL}${firstImage}` : firstImage) : '/placeholder.png')
    }
  }, [product])

  // socket to track stock if you already have socket server
  useEffect(() => {
    if (!id || !socket) return
    socket.emit('joinProduct', id)
    socket.on('productUpdated', (updated) => {
      if (updated._id === id) {
        setLiveStock(updated.stockQuantity ?? updated.stock ?? 0)
      }
    })
    return () => {
      socket.emit('leaveProduct', id)
      socket.off('productUpdated')
    }
  }, [id])

  if (isLoading) return <p>Loading...</p>
  if (!product) return <p>Product not found</p>

  const handleAddToCart = async () => {
    if (!selectedColor) return alert('Please choose a color')
    if (!selectedSize) return alert('Please choose a size')
    if (qty < 1) return alert('Invalid quantity')

    try {
      // Backend POST /carts/:productId adds quantity=1 by default;
      // We'll call add then set desired qty via patch
      const res = await addToCart(product._id).unwrap()
      // Now call changeQty to set desired qty:
      await changeQty({ productId: product._id, qty }).unwrap()

      // Optionally: show toast, refetch happens automatically due to invalidatesTags
      alert('Added to cart')
    } catch (err) {
      console.error(err)
      alert('Failed to add to cart')
    }
  }

  // gallery images array
  const colors = Object.keys(product.imagesByColor || {})
  const imagesForColor = (color) => product.imagesByColor?.[color] || []

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left gallery */}
      <div>
        <div className="mb-4">
          <img src={mainImage} alt={product.name} className="w-full h-[420px] object-cover rounded" />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {colors.map((c) =>
            imagesForColor(c).map((img, idx) => {
              const src = img.startsWith('/uploads')
                ? `${process.env.NEXT_PUBLIC_API_URL}${img}`
                : img
              return (
                <button
                  key={c + '-' + idx}
                  onClick={() => setMainImage(src)}
                  className="w-20 h-20 rounded overflow-hidden border"
                >
                  <img src={src} className="w-full h-full object-cover" />
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Right details */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{product.name}</h1>

        {/* rating */}
        <div className="flex items-center gap-3">
          <div className="flex items-center text-yellow-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} className={`w-4 h-4 ${i < Math.round(product.averageRating || 0) ? 'fill-current text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 24 24"><path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.402 8.168L12 18.896 4.664 23.165l1.402-8.168L.132 9.21l8.2-1.192z"/></svg>
            ))}
          </div>
          <div className="text-sm text-gray-600">{product.averageRating?.toFixed(1) || '0.0'}</div>
        </div>

        {/* price & sale */}
        <div>
          {product.sale ? (
            <div>
              <span className="text-red-600 font-bold text-xl">${product.salePrice}</span>
              <span className="text-gray-500 line-through ml-3">${product.price}</span>
              <span className="ml-2 text-green-600">-{product.discount}%</span>
            </div>
          ) : (
            <div className="text-xl font-semibold">${product.price}</div>
          )}
        </div>

        {/* loyalty / points */}
        <div className="text-sm text-gray-700">
          Earn: <strong>{product.loyaltyPoints ?? 0} pts</strong>
          {product.pointsPrice > 0 && <span className="ml-4">Redeem for: <strong>{product.pointsPrice} pts</strong></span>}
        </div>

        {/* colors as circles */}
        <div>
          <div className="text-sm mb-1 font-medium">Color</div>
          <div className="flex items-center gap-3">
            {colors.length === 0 && <div className="text-gray-500">No images</div>}
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => { setSelectedColor(c) ; const first = imagesForColor(c)[0]; if (first) setMainImage(first.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API_URL}${first}` : first) }}
                className={`w-8 h-8 rounded-full border-2 ${selectedColor === c ? 'ring-2 ring-offset-1' : ''}`}
                title={c}
                style={{
                  backgroundColor: (function () {
                    // try to parse some common color names; fallback to a neutral gradient if unknown
                    const known = { red: 'red', blue: 'blue', black: 'black', white: '#fff', yellow: 'yellow', green: 'green' }
                    return known[c.toLowerCase()] || '#ddd'
                  })(),
                }}
              />
            ))}
          </div>
        </div>

        {/* sizes */}
        <div>
          <div className="text-sm mb-1 font-medium">Size</div>
          <div className="flex gap-2">
            {(product.size || []).map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`px-3 py-1 border rounded ${selectedSize === s ? 'bg-black text-white' : ''}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* qty */}
        <div className="flex items-center gap-3">
          <div className="text-sm font-medium">Quantity</div>
          <div className="flex items-center gap-2">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-1 border rounded">-</button>
            <div className="px-3">{qty}</div>
            <button onClick={() => setQty((q) => q + 1)} className="px-3 py-1 border rounded">+</button>
          </div>
        </div>

        {/* stock / add to cart */}
        {liveStock > 0 ? (
          <button onClick={handleAddToCart} className="px-6 py-2 bg-blue-600 text-white rounded">Add to Cart</button>
        ) : (
          <button disabled className="px-6 py-2 bg-gray-400 text-white rounded cursor-not-allowed">Out of Stock</button>
        )}

        {/* sale countdown (if saleEnd exists) */}
        {product.sale && product.saleEnd && (
          <div className="text-sm text-red-600 mt-2">
            {/* simple countdown */}
            <SaleCountdown saleEnd={product.saleEnd} />
          </div>
        )}
      </div>

      {/* Reviews below (spans full width) */}
      <div className="col-span-2 mt-10">
        <ReviewsGridAndForm productId={id} />
      </div>
    </div>
  )
}

// small countdown component
function SaleCountdown({ saleEnd }) {
  const [left, setLeft] = useState(calcLeft())
  useEffect(() => {
    const t = setInterval(() => setLeft(calcLeft()), 1000)
    return () => clearInterval(t)
  }, [saleEnd])
  function calcLeft() {
    const diff = new Date(saleEnd).getTime() - Date.now()
    if (diff <= 0) return 'Sale ended'
    const d = Math.floor(diff / 86400000)
    const h = Math.floor((diff % 86400000) / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    const s = Math.floor((diff % 60000) / 1000)
    return `${d}d ${h}h ${m}m ${s}s`
  }
  return <div>{left}</div>
}

// 'use client'
// import { useParams } from 'next/navigation'
// import { useGetProductByIdQuery } from '@/features/api/apiSlice'
// import { useDispatch } from 'react-redux'
// import { addToCart } from '@/features/cartSlice'
// import ReviewsGridAndForm from '@/components/ReviewsGridAndForm'
// import { socket } from '@/lib/socket'
// import { useEffect, useState } from 'react'
// import Image from 'next/image'
// import { FaStar } from 'react-icons/fa'

// const API_URL = process.env.NEXT_PUBLIC_API_URL

// export default function ProductDetailPage() {
//   const { id } = useParams()
//   const { data: product, isLoading } = useGetProductByIdQuery(id)
//   const dispatch = useDispatch()

//   // Live stock
//   const [liveStock, setLiveStock] = useState(0)

//   // Selections
//   const [selectedColor, setSelectedColor] = useState(null)
//   const [selectedSize, setSelectedSize] = useState(null)
//   const [qty, setQty] = useState(1)

//   // Gallery state
//   const [mainImage, setMainImage] = useState(null)

//   // Countdown timer
//   const [timeLeft, setTimeLeft] = useState(null)

//   // Socket.io → live stock updates
//   useEffect(() => {
//     if (!id) return
//     socket.emit('joinProduct', id)
//     socket.on('productUpdated', (updated) => {
//       if (updated._id === id) {
//         setLiveStock(updated.stockQuantity)
//       }
//     })
//     return () => {
//       socket.emit('leaveProduct', id)
//       socket.off('productUpdated')
//     }
//   }, [id])

//   // Setup product data
//   useEffect(() => {
//     if (product) {
//       setLiveStock(product.stockQuantity)
//       const firstColor = Object.keys(product.imagesByColor || {})[0]
//       const firstImg = firstColor ? product.imagesByColor[firstColor][0] : null
//       setMainImage(firstImg)
//       if (firstColor) setSelectedColor(firstColor)
//     }
//   }, [product])

//   // Countdown logic
//   useEffect(() => {
//     if (!product?.saleEnd) return

//     const updateTimer = () => {
//       const now = new Date().getTime()
//       const end = new Date(product.saleEnd).getTime()
//       const diff = end - now

//       if (diff <= 0) {
//         setTimeLeft('Sale ended')
//       } else {
//         const days = Math.floor(diff / (1000 * 60 * 60 * 24))
//         const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
//         const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
//         const secs = Math.floor((diff % (1000 * 60)) / 1000)
//         setTimeLeft(`${days}d ${hours}h ${mins}m ${secs}s`)
//       }
//     }

//     updateTimer()
//     const timer = setInterval(updateTimer, 1000)
//     return () => clearInterval(timer)
//   }, [product?.saleEnd])

//   if (isLoading) return <p>Loading...</p>
//   if (!product) return <p>Product not found</p>

//   const images = product.imagesByColor?.[selectedColor] || []
//   const stockToShow = liveStock ?? product.stockQuantity

//   return (
//     <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
//       {/* LEFT: Product Images */}
//       <div>
//         <div className="relative w-full aspect-square border rounded-lg overflow-hidden">
//           <Image
//             src={
//               mainImage
//                 ? mainImage.startsWith('/uploads')
//                   ? `${API_URL}${mainImage}`
//                   : mainImage
//                 : '/placeholder.png'
//             }
//             alt={product.name}
//             fill
//             className="object-cover"
//           />
//         </div>

//         {/* Thumbnails */}
//         <div className="flex mt-4 gap-2">
//           {images.map((img, idx) => (
//             <div
//               key={idx}
//               onClick={() => setMainImage(img)}
//               className={`relative w-20 h-20 border rounded overflow-hidden cursor-pointer ${
//                 mainImage === img ? 'ring-2 ring-blue-500' : ''
//               }`}
//             >
//               <Image
//                 src={img.startsWith('/uploads') ? `${API_URL}${img}` : img}
//                 alt={`thumb-${idx}`}
//                 fill
//                 className="object-cover hover:opacity-75"
//               />
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* RIGHT: Product Info */}
//       <div className="space-y-4">
//         <h1 className="text-2xl font-bold">{product.name}</h1>

//         {/* Ratings */}
//         <div className="flex items-center text-yellow-500 mt-2">
//           {Array.from({ length: 5 }).map((_, i) => (
//             <FaStar
//               key={i}
//               className={
//                 i < Math.round(product.averageRating || 0)
//                   ? 'fill-current'
//                   : 'text-gray-300'
//               }
//             />
//           ))}
//           <span className="ml-2 text-sm text-gray-600">
//             {product.averageRating?.toFixed(1) || '0.0'}
//           </span>
//         </div>

//         <p className="text-gray-700">{product.description}</p>

//         {/* Price */}
//         <div>
//           {product.sale ? (
//             <div>
//               <span className="text-red-600 font-bold text-xl">
//                 PKR {product.price - (product.price * product.discount) / 100}
//               </span>
//               <span className="text-gray-500 line-through ml-2">
//                 PKR {product.price}
//               </span>
//               <span className="ml-2 text-green-600 font-medium">
//                 -{product.discount}%
//               </span>
//             </div>
//           ) : (
//             <p className="text-xl font-semibold">PKR {product.price}</p>
//           )}
//         </div>

//         {/* Sale countdown */}
//         {product.sale && product.saleEnd && (
//           <div className="text-red-600 font-medium">
//             Sale ends in: {timeLeft}
//           </div>
//         )}

//         {/* Loyalty points */}
//         {product.pointsPrice > 0 && (
//           <p className="text-purple-600 font-medium">
//             Or redeem with {product.pointsPrice} points
//           </p>
//         )}

//         {/* Stock */}
//         <div>
//           {stockToShow > 0 ? (
//             <span className="text-green-600">
//               In Stock ({stockToShow} available)
//             </span>
//           ) : (
//             <span className="text-red-600">Out of Stock</span>
//           )}
//         </div>

//         {/* Color swatches */}
//         {Object.keys(product.imagesByColor || {}).length > 0 && (
//           <div>
//             <h3 className="font-medium">Select Color:</h3>
//             <div className="flex gap-3 mt-2">
//               {Object.keys(product.imagesByColor).map((color) => (
//                 <button
//                   key={color}
//                   onClick={() => {
//                     setSelectedColor(color)
//                     setMainImage(product.imagesByColor[color][0])
//                   }}
//                   className={`w-8 h-8 rounded-full border-2 ${
//                     selectedColor === color ? 'ring-2 ring-black' : ''
//                   }`}
//                   style={{ backgroundColor: color }}
//                 />
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Size selection */}
//         {product.size?.length > 0 && (
//           <div>
//             <h3 className="font-medium">Select Size:</h3>
//             <div className="flex gap-2 mt-2">
//               {product.size.map((s) => (
//                 <button
//                   key={s}
//                   onClick={() => setSelectedSize(s)}
//                   className={`px-3 py-1 border rounded ${
//                     selectedSize === s ? 'bg-black text-white' : ''
//                   }`}
//                 >
//                   {s}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Quantity selector */}
//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => setQty(Math.max(1, qty - 1))}
//             className="px-3 py-1 border rounded"
//           >
//             -
//           </button>
//           <span>{qty}</span>
//           <button
//             onClick={() => setQty(qty + 1)}
//             className="px-3 py-1 border rounded"
//           >
//             +
//           </button>
//         </div>

//         {/* Add to Cart */}
//         <button
//           disabled={stockToShow <= 0}
//           onClick={() =>
//             dispatch(
//               addToCart({
//                 ...product,
//                 selectedColor,
//                 selectedSize,
//                 qty,
//               })
//             )
//           }
//           className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
//         >
//           {stockToShow > 0 ? 'Add to Cart' : 'Out of Stock'}
//         </button>
//       </div>

//       {/* REVIEWS */}
//       <div className="col-span-2 mt-10">
//         <ReviewsGridAndForm productId={id} />
//       </div>
//     </div>
//   )
// }
