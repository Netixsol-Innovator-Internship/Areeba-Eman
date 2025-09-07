import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t">
      <div className="container-max">
        <div className="bg-black text-white rounded-2xl p-6 md:p-8 -mt-10 md:-mt-16 mb-10 flex flex-col md:flex-row items-center gap-4 justify-between max-w-5xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-extrabold leading-tight text-center md:text-left">
            STAY UPTO DATE ABOUT
            <br className="hidden md:block" /> OUR LATEST OFFERS
          </h3>
          <div className="w-full md:max-w-md space-y-3">
            <div className="flex items-center bg-white rounded-full px-4 py-3">
              <span className="text-gray-500 mr-2">✉️</span>
              <input
                placeholder="Enter your email address"
                className="flex-1 outline-none text-black"
              />
            </div>
            <button className="btn btn-light bg-white text-black w-full rounded-full">
              Subscribe to Newsletter
            </button>
          </div>
        </div>


        <div className="grid md:grid-cols-5 gap-8 text-sm pb-10">
          <div className="space-y-3">
            <div className="text-2xl font-extrabold">SHOP.CO</div>
            <p className="text-gray-600">We have clothes that suits your style and which you’re proud to wear. From women to men.</p>
            <div className="flex gap-3 text-gray-700">
              <span></span><span></span><span></span><span></span>
            </div>
          </div>
          <Section title="COMPANY" items={["About","Features","Works","Career"]} />
          <Section title="HELP" items={["Customer Support","Delivery Details","Terms & Conditions","Privacy Policy"]} />
          <Section title="FAQ" items={["Account","Manage Deliveries","Orders","Payments"]} />
          <Section title="RESOURCES" items={["Free eBooks","Development Tutorial","How to - Blog","Youtube Playlist"]} />
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 py-6 border-t">
          <p>Shopco © 2000-2025, All Rights Reserved</p>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-gray-100 rounded">VISA</span>
            <span className="px-2 py-1 bg-gray-100 rounded">Mastercard</span>
            <span className="px-2 py-1 bg-gray-100 rounded">PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Section({ title, items }) {
  return (
    <div className="space-y-3 ml-6">
      <h4 className="font-semibold tracking-wider">{title}</h4>
      <ul className="space-y-2 text-gray-600">
        {items.map((i) => <li key={i}><Link href="#" className="hover:text-black">{i}</Link></li>)}
      </ul>
    </div>
  );
}