// "use client"
// import Link from "next/link"
// import { useRouter } from "next/navigation"
// import { useSelector, useDispatch } from "react-redux"
// import { logout } from "../store/authSlice"
// import { useEffect, useState } from "react"

// export default function Navbar() {
//   const router = useRouter()
//   const dispatch = useDispatch()
  
//   // Redux state
//   const reduxLoggedIn = useSelector((state: any) => state.auth?.isLoggedIn)

//   // Local state to avoid SSR mismatch
//   const [isClient, setIsClient] = useState(false)
  
//   useEffect(() => {
//     setIsClient(true) // mark that we are on client
//   }, [])

//   const handleLogout = () => {
//     localStorage.removeItem("token")
//     dispatch(logout())
//     router.push("/login")
//   }

//   if (!isClient) return null // avoid rendering during SSR

//   return (
//     <nav className="bg-[#0b2c69] text-white px-8 py-3 flex justify-between items-center">
//       <div className="flex items-center gap-2">
//         <img src="/carlogo.png" alt="Car Deposit" className="h-8" />
//         <span className="font-bold text-lg">Car Deposit</span>
//       </div>

//       <ul className="flex gap-6 items-center">
//         <li><Link href="/">Home</Link></li>
//         <li><Link href="carAuction">Car Auction</Link></li>
//         <li><Link href="createCar">Sell Your Car</Link></li>
//         <li><Link href="myProfile">ME</Link></li>
//         <li><Link href="#">Notifications</Link></li>

//         {reduxLoggedIn ? (
//           <li>
//             <button
//               onClick={handleLogout}
//               className="bg-white text-[#0b2c69] px-3 py-1 rounded hover:bg-gray-100 transition"
//             >
//               Logout
//             </button>
//           </li>
//         ) : (
//           <>
//             <li>
//               <Link href="/login" className="bg-white text-[#0b2c69] px-3 py-1 rounded hover:bg-gray-100 transition">
//                 Login
//               </Link>
//             </li>
//             <li>
//               <Link href="/register" className="bg-white text-[#0b2c69] px-3 py-1 rounded hover:bg-gray-100 transition">
//                 Signup
//               </Link>
//             </li>
//           </>
//         )}
//       </ul>
//     </nav>
//   )
// }

"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../store/authSlice"
import { useEffect, useRef, useState } from "react"
import { Bell } from "lucide-react";
import { useGetNotificationsQuery, useMarkNotificationReadMutation } from "../features/api/apiSlice"

export default function Navbar() {
  const router = useRouter()
  const dispatch = useDispatch()
  
  // Redux state
  const reduxLoggedIn = useSelector((state: any) => state.auth?.isLoggedIn)

  // Local state
  const [isClient, setIsClient] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const dropdownRef = useRef<HTMLLIElement | null>(null)

  // Queries
  const { data: notifications = [], refetch } = useGetNotificationsQuery(undefined, {
    skip: !reduxLoggedIn,
  })
  const [markNotificationRead] = useMarkNotificationReadMutation()

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showNotifications])

  const handleLogout = () => {
    localStorage.removeItem("token")
    dispatch(logout())
    router.push("/login")
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationRead(id).unwrap()
      refetch()
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  if (!isClient) return null

  return (
    <nav className="bg-[#0b2c69] text-white px-8 py-3 flex justify-between items-center relative">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src="/carlogo.png" alt="Car Deposit" className="h-8" />
        <span className="font-bold text-lg">Car Deposit</span>
      </div>

      {/* Links */}
      <ul className="flex gap-6 items-center">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/carAuction">Car Auction</Link></li>
        <li><Link href="/createCar">Sell Your Car</Link></li>
        <li><Link href="/myProfile">ME</Link></li>

        {/* Notifications */}
        {reduxLoggedIn && (
          <li className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
            >
              <Bell className="h-6 w-6" />
              {notifications.some((n: any) => !n.read) && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {notifications.filter((n: any) => !n.read).length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white text-black rounded-lg shadow-lg overflow-hidden z-50">
                {notifications.length === 0 ? (
                  <p className="p-3 text-gray-500">No notifications</p>
                ) : (
                  notifications.map((notif: any) => (
                    <div
                      key={notif._id}
                      className={`p-3 border-b last:border-0 flex flex-col gap-1 ${
                        notif.read ? "bg-gray-100" : "bg-white"
                      }`}
                    >
                      <p>
                        <span className="font-bold">{notif.sender?.username}</span>{" "}
                        {notif.type === "start" && "started an auction"}
                        {notif.type === "bid" && `placed a bid of $${notif.bid?.amount}`}
                        {notif.type === "comment" && `commented: "${notif.comment}"`}
                      </p>
                      {!notif.read && (
                        <button
                          onClick={() => handleMarkAsRead(notif._id)}
                          className="text-xs text-blue-600 hover:underline self-start"
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </li>
        )}

        {/* Auth buttons */}
        {reduxLoggedIn ? (
          <li>
            <button
              onClick={handleLogout}
              className="bg-white text-[#0b2c69] px-3 py-1 rounded hover:bg-gray-100 transition"
            >
              Logout
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link href="/login" className="bg-white text-[#0b2c69] px-3 py-1 rounded hover:bg-gray-100 transition">
                Login
              </Link>
            </li>
            <li>
              <Link href="/signup" className="bg-white text-[#0b2c69] px-3 py-1 rounded hover:bg-gray-100 transition">
                Signup
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}
