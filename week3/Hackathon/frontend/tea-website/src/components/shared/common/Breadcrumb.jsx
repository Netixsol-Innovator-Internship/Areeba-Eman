import { Link, useLocation } from "react-router-dom"
import Container from "./Container"

const Breadcrumb = () => {
    const location = useLocation()
    const pathnames = location.pathname.split("/").filter((x) => x)

    return (
        <div className="flex items-center justify-center">
            <Container>
                <nav className="flex items-center text-xs md:text-sm uppercase font-medium font-montserrat px-6 sm:px-10 lg:px-12 py-2 md:py-8">
                    <Link to="/" className="hover:text-black transition-colors">
                        Home
                    </Link>

                    {pathnames.map((value, index) => {
                        const to = `/${pathnames.slice(0, index + 1).join("/")}`
                        const isLast = index === pathnames.length - 1

                        return (
                            <span key={to} className="flex items-center">
                                <span className="mx-1">/</span>
                                {isLast ? (
                                    <span>{value}</span>
                                ) : (
                                    <Link to={to}>
                                        {value}
                                    </Link>
                                )}
                            </span>
                        )
                    })}
                </nav>
            </Container>
        </div>
    )
}

export default Breadcrumb
