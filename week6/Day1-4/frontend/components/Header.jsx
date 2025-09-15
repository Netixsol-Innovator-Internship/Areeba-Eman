'use client'
import Link from 'next/link'
import { useProfileQuery } from '@/features/api/apiSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { User, ShoppingCart, Search, Menu } from './icons'
import { logout } from '@/features/authSlice'
import { useState, useRef, useEffect } from 'react'
import { useGetCartQuery, api } from '@/features/api/apiSlice'


export default function Header() {
  const token = useSelector((s) => s.auth.token)
  // const { data: me } = useProfileQuery(undefined, { skip: !token })
  const { data: me } = useProfileQuery();
  const router = useRouter()
  const dispatch = useDispatch()

  // Dropdown state
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const { data: cart } = useGetCartQuery(undefined, { skip: !token }) // skip if not logged
  const cartCount = cart?.items?.reduce((s, it) => s + (it.quantity || 0), 0) || 0

  const handleLogout = async () => {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
    method: 'GET',
    credentials: 'include', // important to remove cookie
  });

  dispatch(logout()); // clear redux / localStorage
  dispatch(api.util.resetApiState());
};


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gray-100 backdrop-blur">
      <div className="px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button className="p-2 md:hidden rounded-xl hover:bg-gray-100">
              <Menu />
            </button>
            <Link href="/" className="text-xl font-extrabold tracking-tight">E-Shop</Link>
          </div>

          {/* Shop Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="hover:underline font-medium px-2 py-1"
            >
              Shop
            </button>
            {open && (
              <div className="absolute left-0 mt-2 w-64 rounded-xl border bg-white p-4 shadow-lg z-50">
                {/* Category */}
                <div>
                  <h4 className="font-semibold mb-1">Category</h4>
                  <ul className="text-sm space-y-1">
                    <li><Link href="/products?category=men" className="block px-2 py-1 rounded hover:bg-gray-100">Men</Link></li>
                    <li><Link href="/products?category=women" className="block px-2 py-1 rounded hover:bg-gray-100">Women</Link></li>
                  </ul>
                </div>

                {/* Style */}
                <div className="mt-3">
                  <h4 className="font-semibold mb-1">Style</h4>
                  <ul className="text-sm space-y-1">
                    <li><Link href="/products?style=casual" className="block px-2 py-1 rounded hover:bg-gray-100">Casual</Link></li>
                    <li><Link href="/products?style=formal" className="block px-2 py-1 rounded hover:bg-gray-100">Formal</Link></li>
                    <li><Link href="/products?style=gym" className="block px-2 py-1 rounded hover:bg-gray-100">Gym</Link></li>
                    <li><Link href="/products?style=party" className="block px-2 py-1 rounded hover:bg-gray-100">Party</Link></li>
                  </ul>
                </div>

                {/* Types */}
                <div className="mt-3">
                  <h4 className="font-semibold mb-1">Types</h4>
                  <ul className="text-sm space-y-1">
                    <li><Link href="/products?type=tshirt" className="block px-2 py-1 rounded hover:bg-gray-100">T-Shirts</Link></li>
                    <li><Link href="/products?type=jeans" className="block px-2 py-1 rounded hover:bg-gray-100">Jeans</Link></li>
                    <li><Link href="/products?type=shirts" className="block px-2 py-1 rounded hover:bg-gray-100">Shirts</Link></li>
                    <li><Link href="/products?type=hoodies" className="block px-2 py-1 rounded hover:bg-gray-100">Hoodies</Link></li>
                    <li><Link href="/products?type=shorts" className="block px-2 py-1 rounded hover:bg-gray-100">Shorts</Link></li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="flex w-full items-center gap-2 rounded-xl border bg-white px-3 py-2">
              <Search />
              <input className="w-full outline-none" placeholder="Search products..." />
            </div>
          </div>

          {/* Right nav */}
          <nav className="flex space-between gap-8 items-center">
          <Link href="/cart" className="rounded-xl hover:bg-gray-100 p-2 relative">
            <ShoppingCart />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

            {(me?.roles?.includes('admin') || me?.roles?.includes('superadmin')) && (
              <Link href="/dashboard" className="font-medium text-blue-900 hover:text-blue-600">
                Dashboard
              </Link>
            )}

            {me ? (
              <div className="flex items-center gap-6">
                <Link href="/myprofile" className="font-medium">{me.fullName}</Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-red-400 hover:bg-red-500 text-white"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="p-2 rounded-xl hover:bg-gray-100"
              >
                <User />
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
