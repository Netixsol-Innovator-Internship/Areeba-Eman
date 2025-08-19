import Button from "../shared/buttons/button";
import Container from "../shared/common/Container";
import { useNavigate } from 'react-router-dom';


const Hero = () => {
  const navigate = useNavigate();
  const handleBtn = ()=>{
    navigate('/collections')
  }
  return (
    <>
      <div className='flex flex-col items-center justify-center'>
        <Container>
          {/* Top hero section */}
          <div className='w-full grid grid-cols-1 mb-24 md:grid-cols-2 mx-0 gap-12 lg:gap-32 overflow-x-hidden'>
            <div className='w-[100%]'>
              <img className='h-[628px] w-full  object-cover' src="./heroimage/Landing-Main-Image.png" alt="" />
            </div>
            <div className='flex flex-col justify-center px-3 md:pl-0 md:pr-18'>
              <div className="flex md:block flex-col items-center justify-center px-6 sm:px-0" >
                <h3 className='font-prosto max-w-md text-[36px] font-medium'>Every day is unique, just like our tea</h3>
                <p className='text-[16px] max-w-md text-base font-montserrat my-10'>Lorem ipsum dolor sit amet consectetur. Orci nibh nullam risus adipiscing odio. Neque lacus nibh eros in.
                  <br />
                  Lorem ipsum dolor sit amet consectetur. Orci nibhnullam risus adipiscing odio. Neque lacus nibherosin.
                </p>
                <p className='text-[16px] max-w-md text-base font-montserrat '></p>
                <Button className="bg-[#282828] self-start text-white" onClick={handleBtn}> BROWSE TEAS</Button>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}

export default Hero