// components/ReviewCard.jsx
'use client'
import React from 'react'
import { FaStar } from 'react-icons/fa'

export default function ReviewCard({ review }) {
  // backend populated user stored in review.userId
  const user = review.userId || review.user || {}
  const name = user.fullName || user.name || 'Anonymous'

  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-[260px] h-[260px] flex flex-col justify-between">
  <div>
    <div className="flex items-center justify-between mb-2">
      <div className="text-sm font-medium truncate">{name}</div>
      <div className="flex items-center text-yellow-400">
        {Array.from({ length: 5 }).map((_, i) => (
          <FaStar
            key={i}
            className={i < Math.round(review.stars || 0) ? 'text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    </div>

    <div className="text-gray-700 text-sm line-clamp-4">
      {review.comment || '—'}
    </div>
  </div>

  <div className="text-xs text-gray-400 mt-3">
    {new Date(review.createdAt).toLocaleString()}
  </div>
</div>

  )
}
