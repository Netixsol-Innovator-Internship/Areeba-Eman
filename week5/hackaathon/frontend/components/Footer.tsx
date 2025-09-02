export default function Footer() {
  return (
    <footer className="bg-[#0b2c69] text-white mt-12 px-8 py-6 mx-0">
      <div className="grid grid-cols-3 gap-8">
        <div>
          <h2 className="font-bold">Car Deposit</h2>
          <p className="text-sm mt-2">Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur.</p>
        </div>
        <div>
          <h2 className="font-bold">Quick Links</h2>
          <ul className="text-sm mt-2 space-y-1">
            <li>Help Center</li>
            <li>FAQ</li>
            <li>My Account</li>
          </ul>
        </div>
        <div>
          <h2 className="font-bold">About us</h2>
          <p className="text-sm mt-2">Email: info@cardeposit.com</p>
          <p className="text-sm">Call: +1 379-404-9302</p>
        </div>
      </div>
      <p className="text-center text-sm mt-4">Copyright 2022 | All Rights Reserved</p>
    </footer>
  )
}
