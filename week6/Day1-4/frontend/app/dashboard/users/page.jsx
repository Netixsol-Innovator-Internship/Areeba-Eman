// 'use client'

// import { useState, useEffect } from 'react'
// import { useSelector } from 'react-redux'
// import io from 'socket.io-client'
// import {
//   useGetUsersQuery,
//   useUpdateUserRoleMutation,
//   useProfileQuery,
// } from '@/features/api/apiSlice'

// let socket

// export default function UsersPage() {
//   const { data: users = [], isLoading } = useGetUsersQuery()
//   const [updateRole] = useUpdateUserRoleMutation()
//   const { data: me } = useProfileQuery()

//   const [userList, setUserList] = useState([])

//   // Initialize socket once
//   useEffect(() => {
//     socket = io('https://easygoing-spontaneity-production.up.railway.app') // your backend socket.io server
//     socket.on('userUpdated', (updatedUser) => {
//       setUserList((prev) =>
//         prev.map((u) => (u._id === updatedUser._id ? { ...u, ...updatedUser } : u))
//       )
//     })

//     return () => socket.disconnect()
//   }, [])

//   // Sync userList with API data when it changes
//   useEffect(() => {
//     setUserList(users)
//   }, [users])

//   const handleRoleChange = async (id, currentRoles) => {
//     try {
//       const newRole = currentRoles.includes('admin') ? 'user' : 'admin'
//       const updated = await updateRole({ id, roles: [newRole] }).unwrap()

//       // Update local state immediately
//       setUserList((prev) =>
//         prev.map((u) => (u._id === updated._id ? updated : u))
//       )

//       // Emit socket event if backend listens
//       socket.emit('updateUserRole', { id, role: newRole })
//     } catch (err) {
//       console.error(err)
//       alert('Failed to update role')
//     }
//   }

//   if (isLoading) return <p>Loading users...</p>

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       {userList.map((u) => (
//         <div
//           key={u._id}
//           className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
//         >
//           <h2 className="text-xl font-bold">{u.fullName}</h2>
//           <p><strong>Email:</strong> {u.email}</p>
//           <p><strong>Role:</strong> {u.roles.join(', ')}</p>
//           <p><strong>Loyalty Points:</strong> {u.loyaltyPoints}</p>
//           <p><strong>Orders:</strong> {u.orders?.length || 0}</p>

//           {me?.roles?.includes('superadmin') && (
//             <button
//               onClick={() => handleRoleChange(u._id, u.roles)}
//               className="mt-2 px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
//             >
//               Set {u.roles.includes('admin') ? 'User' : 'Admin'}
//             </button>
//           )}
//         </div>
//       ))}
//     </div>
//   )
// }
'use client'

import { useState, useEffect } from 'react'
import io from 'socket.io-client'
import {
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useProfileQuery,
} from '@/features/api/apiSlice'

let socket

export default function UsersPage() {
  const { data: users = [], isLoading } = useGetUsersQuery()
  const [updateRole] = useUpdateUserRoleMutation()
  const { data: me } = useProfileQuery()

  const [userList, setUserList] = useState([])

  // Initialize socket once
  useEffect(() => {
    socket = io(process.env.NEXT_PUBLIC_API_URL)

    socket.on('userUpdated', (updatedUser) => {
      setUserList((prev) =>
        prev.map((u) => (u._id === updatedUser._id ? { ...u, ...updatedUser } : u))
      )
    })

    return () => socket.disconnect()
  }, [])

  // Sync userList with API data ONLY if different
  useEffect(() => {
    // Compare IDs to avoid unnecessary setState
    const idsChanged =
      users.length !== userList.length ||
      users.some((u, idx) => u._id !== userList[idx]?._id)

    if (idsChanged) {
      setUserList(users)
    }
  }, [users, userList])

  const handleRoleChange = async (id, currentRoles) => {
    try {
      const newRole = currentRoles.includes('admin') ? 'user' : 'admin'
      const updated = await updateRole({ id, roles: [newRole] }).unwrap()

      setUserList((prev) =>
        prev.map((u) => (u._id === updated._id ? updated : u))
      )

      socket.emit('updateUserRole', { id, role: newRole })
    } catch (err) {
      console.error(err)
      alert('Failed to update role')
    }
  }

  if (isLoading) return <p>Loading users...</p>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {userList.map((u) => {
        const isSuperadmin = u.roles.includes('superadmin')
        const canChangeRole = me?.roles?.includes('superadmin') && !isSuperadmin

        return (
          <div
            key={u._id}
            className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-bold">{u.fullName}</h2>
            <p><strong>Email:</strong> {u.email}</p>
            <p><strong>Role:</strong> {u.roles.join(', ')}</p>
            <p><strong>Loyalty Points:</strong> {u.loyaltyPoints}</p>
            {/* <p><strong>Orders:</strong> {u.orders?.length || 0}</p> */}

            {canChangeRole && (
              <button
                onClick={() => handleRoleChange(u._id, u.roles)}
                className="mt-2 px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Set {u.roles.includes('admin') ? 'User' : 'Admin'}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
