const ProductCard = ({ image, title, price,weight,onClick }) => {
    return (
        <div className="w-auto flex flex-col items-center justify-center bg-white overflow-hidden font-montserrat cursor-pointer" onClick={onClick}>
            {/* Image */}
            <div className="w-[172px] h-[172px] md:w-[264px] md:h-[264px] bg-gray-100 flex items-center justify-center">
                <img
                    src={image || "/placeholder.svg"}
                    alt={title}
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col items-center justify-center font-montserrat space-y-2">
                {/* Title */}
                <h3 className="text-sm md:text-base text-center text-black max-w-[174px]">
                    {title}
                </h3>

                {/* Price */}
                <p className="text-sm md:text-base font-medium text-black">
                    ${price} <span className="text-gray-500 text-xs md:text-sm">/ {weight}</span>
                </p>
            </div>
        </div>
    )
}

export default ProductCard
