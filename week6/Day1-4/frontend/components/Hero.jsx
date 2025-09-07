'use client'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className=" w-full">
      <div
        className="w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-bg.png')" }}>

        <div className="container  flex flex-col-reverse lg:flex-row items-center justify-between px-6 lg:px-16 py-16">
          {/* Left Content */}
          <div className="w-full lg:w-[500px] text-left space-y-6 bg-white/80 p-6 rounded-xl lg:bg-transparent lg:p-0">
            <h1 className="text-5xl font-extrabold leading-tight">
              FIND CLOTHES <br />
              THAT MATCHES <br />
              <span className="text-black">YOUR STYLE</span>
            </h1>
            <p className="text-gray-700 leading-relaxed">
              Browse through our diverse range of meticulously crafted garments,
              designed to bring out your individuality and cater to your sense of style.
            </p>
            <button className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition">
              Shop Now
            </button>

            {/* Stats */}
            <div className="flex gap-10 pt-6">
              <div>
                <p className="text-3xl font-bold">200+</p>
                <p className="text-gray-700 text-sm">International Brands</p>
              </div>
              <div>
                <p className="text-3xl font-bold">2,000+</p>
                <p className="text-gray-700 text-sm">High-Quality Products</p>
              </div>
              <div>
                <p className="text-3xl font-bold">30,000+</p>
                <p className="text-gray-700 text-sm">Happy Customers</p>
              </div>
            </div>
          </div>

          {/* Right Image (Optional Decorative Image) */}
          <div className="relative w-full lg:w-[600px] h-[450px] lg:h-[650px]">
            {/* You can place an extra decorative image here if needed */}
          </div>
        </div>
      </div>

      {/* Brand Names Row (Separate) */}
      <div className=" bg-black py-6 flex flex-wrap justify-center gap-20 ">
        {['VERSACE', 'ZARA', 'GUCCI', 'PRADA', 'Calvin Klein'].map((brand) => (
          <a
            key={brand}
            href="#"
            className="text-2xl font-bold text-white hover:text-gray-200 transition"
          >
            {brand}
          </a>
        ))}
      </div>
    </section>
  )
}
