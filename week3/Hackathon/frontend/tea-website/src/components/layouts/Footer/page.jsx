import Container from "../../shared/common/Container"
import { footerData } from "../../../constants/gernal"
import { Link } from "react-router-dom"

const Footer = () => {

    return (
        <div className="flex items-center justify-center bg-[#F4F4F4] font-montserrat">
            <Container>
                 <div className="w-full py-12  px-6 sm:px-10 lg:px-12 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {/* Collections */}
                        <div className="row-span-2">
                        <h3 className="font-medium mb-4 uppercase text-[#282828]  text-base leading-6">Collections</h3>
                        <ul className="space-y-2 text-sm font-normal leading-5 text-[#282828]">
                            {footerData.collections.map((item, index) => (
                            <li key={index} className=" hover:text-black cursor-pointer" onClick={()=> window.scrollTo({ top: 0, behavior: "smooth" })}>
                               <Link to={'/collections'}>{item}</Link>
                            </li>
                            ))}
                        </ul>
                        </div>

                        {/* Learn */}
                        <div>
                        <h3 className="font-medium mb-4 uppercase text-[#282828]  text-base leading-6">Learn</h3>
                        <ul className="space-y-2 text-sm font-normal leading-5 text-[#282828]">
                            {footerData.learn.map((item, index) => (
                            <li key={index} className=" hover:text-black cursor-pointer">
                                {item}
                            </li>
                            ))}
                        </ul>
                        </div>

                        {/* Customer Service */}
                        <div>
                        <h3 className="font-medium mb-4 uppercase text-[#282828]  text-base leading-6">Customer Service</h3>
                        <ul className="space-y-2 text-sm font-normal leading-5 text-[#282828]">
                            {footerData.customerService.map((item, index) => (
                            <li key={index} className=" hover:text-black cursor-pointer">
                                {item}
                            </li>
                            ))}
                        </ul>
                        </div>

                        {/* Contact Us */}
                        <div className="col-span-2 md:col-auto">
                        <h3 className="font-medium mb-4 uppercase text-[#282828]  text-base leading-6">Contact Us</h3>
                        <ul className="space-y-3 text-sm font-normal  leading-5 text-[#282828]">
                            <li className="flex items-start cursor-pointer gap-2">
                            {/* Location Icon (SVG) */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z"/>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 22s8-4.438 8-12a8 8 0 10-16 0c0 7.562 8 12 8 12z"/>
                            </svg>
                            <span>
                                3 Falahi, Falahi St, Pasdaran Ave,
                                <br /> Shiraz, Fars Province <br /> Iran
                            </span>
                            </li>
                            <li className="flex items-center cursor-pointer gap-2">
                            {/* Email Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                            </svg>
                            <span>amoopour@gmail.com</span>
                            </li>
                            <li className="flex items-center cursor-pointer gap-2">
                            {/* Phone Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5v2c0 5.523 4.477 10 10 10h2v-2a2 2 0 012-2h2a2 2 0 012 2v2c0 1.105-.895 2-2 2C10.477 22 2 13.523 2 4c0-1.105.895-2 2-2z"/>
                            </svg>
                            <span>+98 9173038406</span>
                            </li>
                        </ul>
                        </div>
                 </div>
            </Container>
        </div>
    )
}

export default Footer