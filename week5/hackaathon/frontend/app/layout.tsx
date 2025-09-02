"use client"

import { Provider } from "react-redux"
import { store } from "../store/store"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <Navbar />
          {children}
          <Footer />
        </Provider>
      </body>
    </html>
  )
}


// import "./globals.css"

// export const metadata = {
//   title: "Frontend",
//   description: "Hackathon project",
// }

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className="flex items-center justify-center min-h-screen">
//         {children}
//       </body>
//     </html>
//   )
// }
