'use client'
import Link from 'next/link'

const categories =  [
  {
    name: 'Casual',
    href: '/products?style=casual',
    img: '/image11.png',
    className: 'col-span-1 row-span-1',
  },
  {
    name: 'Formal',
    href: '/products?style=formal',
    img: '/image13.png',
    className: 'col-span-2 row-span-1',
  },
  {
    name: 'Party',
    href: '/products?style=party',
    img: '/image12.png',
    className: 'col-span-2 row-span-1',
  },
  {
    name: 'Gym',
    href: '/products?style=gym',
    img: '/image14.png',
    className: 'col-span-1 row-span-1',
  },
]


export default function BrowseCard() {
  return (
    <div className="px-4 py-12 max-w-5xl mx-auto bg-gray-200 rounded-lg my-8">
      <h2 className="text-4xl font-extrabold mb-10  text-center">Browse by Dress Style</h2>
      <div className="grid grid-cols-3 grid-rows-2 gap-4">
        {categories.map((cat, i) => (
          <Link
            key={i}
            href={cat.href}
            className={`relative rounded-lg overflow-hidden shadow-lg group ${cat.className} h-40 md:h-60`}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
              style={{ backgroundImage: `url(${cat.img})` }}
            />
            {/* Overlay */}
            <div className="absolute inset-0 transition" />
            {/* Title */}
            <h3 className="absolute top-3 left-3 text-black font-bold text-xl z-10">
              {cat.name}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  )
}
