import { useState } from "react";
import { useEffect } from "react";
import Container from "../../shared/common/Container";
import hamburgerIcon from "../../../assets/header/hamburger.svg";
import { NavList, Icons } from "../../../constants/gernal";
import { Link } from "react-router-dom";
import CartPopup from "../../shared/common/Cartpopup";
import { MobileMenu } from "./MobileMenu";
import logo from "../../../assets/header/logo.svg";


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);



  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex items-center justify-center font-montserrat">
      <Container>
        {/* Header - hidden when menu is open */}
        {!isMenuOpen && (
          <header className="flex items-center justify-between my-2 px-6 sm:px-2 md:my-7 lg:px-12 w-full">
            {/* Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <img src={logo} alt="Company Logo" className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />
              <h1 className="text-sm sm:text-xl md:text-xl font-prosto font-normal">Brand Name</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-3 lg:gap-6">
              {Object.entries(NavList).map(([key, item]) => (
                <Link
                  key={key}
                  to={item.path}
                  className="text-[#282828] text-xs lg:text-sm font-montserrat hover:text-black uppercase whitespace-nowrap"
                >
                  {item.value}
                </Link>
              ))}
            </nav>

            {/* Side Icons + Hamburger */}
            <div className="flex items-center gap-3 sm:gap-6 lg:gap-9 flex-shrink-0">
              {/* Desktop icons */}
              {Object.entries(Icons).map(([key, icon]) =>
                icon.alt === "cart Icon" ? (
                  <button
                    key={key}
                    onClick={() => setIsCartOpen(!isCartOpen)}
                    className="hidden md:block cursor-pointer"
                  >
                    <img src={icon.src} alt={icon.alt} className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                ) : (
                  <Link key={key} to={icon.path} className="cursor-pointer">
                    <img
                      src={icon.src}
                      alt={icon.alt}
                      className="hidden md:block h-5 w-5 sm:h-6 sm:w-6"
                    />
                  </Link>
                )
              )}

              {/* Hamburger (mobile only) */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden relative focus:outline-none"
              >
                <img src={hamburgerIcon} alt="Menu" className="h-7 w-7 sm:h-6 sm:w-6" />
              </button>
            </div>
          </header>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <MobileMenu onClose={() => setIsMenuOpen(false)} />
        )}

        {isCartOpen && <CartPopup onClose={() => setIsCartOpen(false)} />}
      </Container>
    </div>
  );
};

export default Header;