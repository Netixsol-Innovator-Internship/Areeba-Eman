import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Icons, NavList } from "../../../constants/gernal";
import logo from "../../../assets/header/logo.svg";
import { Link } from "react-router-dom";


export const MobileMenu = ({ onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose(), 300); // match transition duration
    };

    return (
        <div
            onClick={handleClose}
            className={`fixed inset-0 bg-[#282828]/50 z-50 flex justify-end transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"
                }`}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`bg-white w-[267px] h-screen shadow-lg flex flex-col transform transition-transform duration-300 ${isVisible ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Scrollable content */}
                <div className="overflow-y-auto flex-1 flex flex-col justify-between">
                    <div className="p-4">
                        {/* Close button */}
                        <div className="flex justify-end">
                            <button onClick={handleClose}>
                                <X />
                            </button>
                        </div>

                        {/* Search bar */}
                        <div className="mt-4 relative">
                            <input
                                type="text"
                                placeholder="SEARCH PRODUCTS"
                                className="w-full border border-[#282828] text-xs placeholder:text-[#A0A0A0] placeholder:uppercase px-3 py-2 pl-8 focus:outline-none"
                            />
                            <img
                                className="absolute left-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                                src={Icons.search.src}
                                alt=""
                            />
                        </div>

                        {/* Profile + Bag */}
                        <div className="mt-4 space-y-4">
                            <div className="flex items-center gap-2 text-sm">
                                <img src={Icons.user.src} alt="User" className="h-6 w-6" />
                                <p className="text-[11px] font-medium text-[#282828]">
                                    USER PROFILE<br />
                                    <span className="text-xs text-[#A0A0A0] font-normal">
                                        We know you as a guest user
                                    </span>
                                </p>
                            </div>
                            <div
                                className="flex items-center gap-2 text-sm cursor-pointer"
                                onClick={handleClose}
                            >
                                <img src={Icons.cart.src} alt="Bag" className="h-6 w-6" />
                                <p className="text-[11px] font-medium text-[#282828]">
                                    YOUR BAG<br />
                                    <span className="text-xs text-[#A0A0A0] font-normal">
                                        <span className="text-[#C3B212]">(3)</span> items have been added
                                    </span>
                                </p>
                            </div>
                        </div>

                        <hr className="my-7" />
                        {/* Nav Links */}
                        <nav className="space-y-3">
                            {Object.entries(NavList).map(([key, item]) => (
                                <Link
                                    key={key}
                                    to={item.path}
                                    onClick={handleClose}
                                    className="block text-sm uppercase text-gray-800 hover:text-black"
                                >
                                    {item.value}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Footer area */}
                    <div className="bg-[#F4F4F4] py-8 px-4 flex flex-col gap-4">
                        <div className="brand flex justify-start items-center gap-2">
                            <img src={logo} className="w-[18px] h-[18px]" alt="" />
                            <h2 className="font-medium text-[14px]">Brand Name</h2>
                        </div>
                        <p className="text-xs leading-4 text-[#282828]">
                            We offer loose tea leaves of the best quality for your business...
                        </p>
                        <p className="text-xs text-[#A0A0A0]">
                            ALL RIGHTS RESERVED BY Brand Name Co
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
