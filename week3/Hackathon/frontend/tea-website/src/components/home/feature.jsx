import Button from "../shared/buttons/button";
import { Features } from '../../constants/gernal';
import Container from "../shared/common/Container";



const Feature = () => {
  return (
    <>
      <div className='flex flex-col items-center justify-center bg-[#F4F4F4]'>
        <Container>
          {/* feaures section */}
          <div className="features-area w-full py-12  px-6 sm:px-10 lg:px-12 flex flex-col justify-center items-center gap-8 sm:gap-12">
            {/* Small screen: 2-column grid */}
<div className="w-full mb-2 px-4 grid grid-cols-2 gap-4 sm:hidden">
  {Features.map((item, index) => (
    <div key={index} className="flex items-center gap-2 text-left">
      <img
        src={item.icon || "/placeholder.svg"}
        alt={item.text}
        className="h-5 w-5 flex-shrink-0"
      />
      <span className="text-sm font-medium break-words">
        {item.text}
      </span>
    </div>
  ))}
</div>

{/* Medium and larger screens */}
<div className="hidden sm:flex w-full flex-wrap gap-4 mb-2 px-12 justify-between">
  {Features.map((item, index) => (
    <div key={index} className="flex items-center gap-2 text-left max-w-xs">
      <img
        src={item.icon || "/placeholder.svg"}
        alt={item.text}
        className="h-6 w-6 flex-shrink-0"
      />
      <span className="text-base font-medium break-words">
        {item.text}
      </span>
    </div>
  ))}
</div>

            <Button className="border">LEARN MORE</Button>
          </div>
        </Container>
      </div>
    </>
  )
}

export default Feature