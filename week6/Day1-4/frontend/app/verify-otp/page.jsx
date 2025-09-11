'use client'
import { Suspense } from 'react'
import otpContent from './otpContent.jsx'

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <otpContent/>
    </Suspense>
  )
}
