import line from '../../assets/cart/Line.png'
const TopBar = () => {
    return (
        <div className="hidden md:flex items-center justify-between px-6 sm:px-10 lg:px-12">
            <h2 className="text-xl font-montserrat uppercase " >1. my bag</h2>
            <img src={line} className='w-20 lg:w-40 xl:w-auto' />
            <h2 className="text-xl font-montserrat uppercase" >2. delivery</h2>
            <img src={line} className='w-20 lg:w-40 xl:w-auto' />
            <h2 className="text-xl font-montserrat uppercase" >3. Review & Payment </h2>
        </div>
    )
}

export default TopBar