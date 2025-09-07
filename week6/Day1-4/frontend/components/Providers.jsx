'use client'
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { loadToken } from '@/features/authSlice'

function InitAuth() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(loadToken())   // ✅ load token after client mounts
  }, [dispatch])
  return null
}

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <InitAuth />
      {children}
    </Provider>
  )
}
