"use client"
import { useState } from "react"
export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  return (
    <header className="bg-[rgba(49,49,49,1)]">
      <div className="max-w-[1500px] m-auto text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2 pl-4">
              <img src="/image2.svg" alt="Logo" className="w-7 h-9" />
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-gray-300 hover:text-red-400">
                STORE
              </a>
              <a href="#" className="text-gray-300 hover:text-red-400">
                FAQ
              </a>
              <a href="#" className="text-gray-300 hover:text-red-400">
                HELP
              </a>
              <a href="#" className="text-gray-300 hover:text-red-400">
                UNREAL ENGINE
              </a>
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="hover:text-white cursor-pointer">
              <img src="/Vector.svg" alt="Logo" className="w-7 h-9" />
            </div>

            <div className="text-gray-300 flex items-center hover:text-white cursor-pointer space-x-2">
              <img src="/Frame.svg" alt="Logo" className="w-7 h-9" />
              <p className="inline-block text-xs">SIGN IN</p>
            </div>

            <div className="text-sm bg-[#007AFF] hover:bg-blue-700 text-white px-5 py-3 cursor-pointer">
              <p>DOWNLOAD</p>
            </div>
          </div>

          <button
            className="md:hidden flex flex-col items-center justify-center w-8 h-8 pr-4"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-gray-300 transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-gray-300 mt-1 transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-gray-300 mt-1 transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
            ></span>
          </button>
        </div>

        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
        >
          <div className="px-4 py-4 space-y-4 border-t border-gray-600">
            {/* Mobile navigation */}
            <nav className="flex flex-col space-y-3">
              <a href="#" className="text-gray-300 hover:text-red-400 py-2">
                STORE
              </a>
              <a href="#" className="text-gray-300 hover:text-red-400 py-2">
                FAQ
              </a>
              <a href="#" className="text-gray-300 hover:text-red-400 py-2">
                HELP
              </a>
              <a href="#" className="text-gray-300 hover:text-red-400 py-2">
                UNREAL ENGINE
              </a>
            </nav>

            {/* Mobile actions */}
            <div className="flex flex-col space-y-3 pt-3 border-t border-gray-600">
              <div className="flex items-center space-x-2 hover:text-white cursor-pointer py-2">
                <img src="/Vector.svg" alt="Search" className="w-5 h-5" />
                <span className="text-gray-300">SEARCH</span>
              </div>

              <div className="text-gray-300 flex items-center hover:text-white cursor-pointer space-x-2 py-2">
                <img src="/Frame.svg" alt="Sign In" className="w-5 h-5" />
                <p className="text-xs">SIGN IN</p>
              </div>

              <div className="text-sm bg-[#007AFF] hover:bg-blue-700 text-white px-4 py-3 cursor-pointer text-center">
                <p>DOWNLOAD</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
