// // components/ReviewsSlider.jsx
// 'use client'
// import React, { useRef, useEffect } from 'react'
// import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
// import { useGetProductRatingsQuery } from '@/features/api/apiSlice'
// import { useGetAllReviewsQuery } from '@/features/api/apiSlice'
// import ReviewCard from './ReviewCard'
// import io from 'socket.io-client'

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

// export default function ReviewsSlider({ productId }) {
// //   const { data: reviews = [], isLoading, refetch } = useGetProductRatingsQuery(productId, {
// //     skip: !productId,
// //   })
//  const { data: reviews = [], isLoading, refetch } = useGetAllReviewsQuery()


//   const elRef = useRef(null)
//   const socketRef = useRef(null)

//   useEffect(() => {
//     if (!productId) return
//     // connect socket and listen for ratingAdded (productId match)
//     socketRef.current = io(API_URL, {
//       // optionally send auth info: { auth: { userId: '...', roles: '...' } }
//     })
//     socketRef.current.on('ratingAdded', (payload) => {
//       if (payload?.productId === productId) {
//         refetch()
//       }
//     })
//     return () => socketRef.current?.disconnect()
//   }, [productId, refetch])

//   const scroll = (dir = 'right') => {
//     const el = elRef.current
//     if (!el) return
//     const amount = el.clientWidth * 0.7
//     el.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' })
//   }

//   if (isLoading) return <div>Loading reviews...</div>
//   if (!reviews.length) return <div>No reviews yet</div>

//   return (
//     <div className="relative">
//       <button
//         onClick={() => scroll('left')}
//         className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-white rounded-full shadow"
//         aria-label="Prev"
//       >
//         <FaChevronLeft />
//       </button>

//       <div
//         ref={elRef}
//         className="flex gap-4 overflow-x-auto py-4 px-8 scroll-smooth"
//         style={{
//           scrollSnapType: 'x mandatory',
//           WebkitOverflowScrolling: 'touch',
//         }}
//       >
//         {reviews.map((r) => (
//           <div
//             key={r._id}
//             className="scroll-snap-start"
//             style={{ scrollSnapAlign: 'start' }}
//           >
//             <ReviewCard review={r} />
//           </div>
//         ))}
//       </div>

//       <button
//         onClick={() => scroll('right')}
//         className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-white rounded-full shadow"
//         aria-label="Next"
//       >
//         <FaChevronRight />
//       </button>
//     </div>
//   )
// }
'use client'
import React, { useEffect, useState } from 'react'
import { useGetAllReviewsQuery } from '@/features/api/apiSlice'
import { socket } from '../lib/socket'
import ReviewCard from './ReviewCard'

export default function ReviewSlider() {
  const { data: reviews = [] } = useGetAllReviewsQuery()
  const [liveReviews, setLiveReviews] = useState([])

  useEffect(() => {
    socket.on("newReview", (review) => {
      setLiveReviews((prev) => [review, ...prev])
    })
    return () => socket.off("newReview")
  }, [])

  return (
    <div className="flex gap-4 overflow-x-auto p-4">
      {[...liveReviews, ...reviews].map((r) => (
        <ReviewCard key={r._id} review={r} />
      ))}
    </div>
  )
}

