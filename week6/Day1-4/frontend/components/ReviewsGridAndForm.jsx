'use client'
import React, { useState, useEffect } from 'react'
import { FaStar } from 'react-icons/fa'
import { useGetProductRatingsQuery, useAddRatingMutation } from '@/features/api/apiSlice'
import { useSelector } from 'react-redux'
import ReviewCard from './reviewCard'
import { socket } from '@/lib/socket'

export default function ReviewsGridAndForm({ productId }) {
  const token = useSelector((s) => s.auth.token)
  const { data: reviews = [], isLoading, refetch } = useGetProductRatingsQuery(productId, { skip: !productId })
  const [addRating, { isLoading: adding }] = useAddRatingMutation()

  const [stars, setStars] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState('')
  const [liveReviews, setLiveReviews] = useState([])

  useEffect(() => {
    if (!productId) return
    refetch()
    socket.emit("joinRoom", productId)

    socket.on("newReview", (review) => {
      if (review.productId === productId) {
        setLiveReviews((prev) => [review, ...prev])
      }
    })

    return () => {
      socket.emit("leaveRoom", productId)
      socket.off("newReview")
    }
  }, [productId, refetch])

  const submit = async (e) => {
    e.preventDefault()
    if (!token) return alert("Please login to submit a review")
    if (stars < 1) return alert("Please select a star rating")
    try {
      const review = await addRating({ productId, stars, comment }).unwrap()
      socket.emit("addReview", review) // notify others
      setStars(0)
      setComment("")
    } catch (err) {
      console.error(err)
      alert("Failed to submit review")
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex gap-4">
          {[...liveReviews, ...reviews].map((r) => (
            <ReviewCard key={r._id} review={r} />
          ))}
        </div>
      )}

      <div className="border rounded p-4 bg-gray-100">
        <h4 className="font-semibold mb-2">Write a review</h4>
        <form onSubmit={submit} className="space-y-3">
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => {
              const val = i + 1
              return (
                <button
                  type="button"
                  key={i}
                  onMouseEnter={() => setHover(val)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setStars(val)}
                  className="focus:outline-none"
                >
                  <FaStar className={`text-2xl ${val <= (hover || stars) ? 'text-yellow-400' : 'text-gray-300'}`} />
                </button>
              )
            })}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            className="w-full border rounded p-2"
            rows={4}
          />

          <button type="submit" disabled={adding} className="px-4 py-2 bg-blue-600 text-white rounded">
            {adding ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  )
}
