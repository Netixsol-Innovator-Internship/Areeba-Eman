
import React from 'react'
import { ChevronRightIcon } from 'lucide-react'
import Button from '../shared/buttons/button'
import visa from "../../assets/cart/visa.png"
import maestro from "../../assets/cart/maestro.png"
import mastercard from "../../assets/cart/mastecard.png" // you wrote mastecard, typo?
import ideal from "../../assets/cart/ideal.png"


const OrderSummary = ({delivery,subtotal,total}) => {
  return (
    <div className='sm:w-[455px] font-montserrat py-3'>
      {/* ordersummary box */}
      <div className='bg-[#F4F4F4] py-11 px-6 w-full'>
        <h3 className='text-xl' >Order summery</h3>
        {/* sub total */}
        <div className='flex items-center justify-between w-full pb-2 pt-6'>
          <span>Subtotal</span>
          <span className='font-medium'>€{subtotal}</span>
        </div>
        {/* delivery */}
        <div className='flex items-center justify-between w-full pb-2 pt-2'>
          <span>Delivery</span>
          <span className='font-medium'>€{delivery}</span>
        </div>
        {/* divider */}
        <div className="border-b border-[#A0A0A0] my-4 mx-6 "></div>
        {/* total */}
        <div className='flex items-center justify-between w-full pb-2'>
          <span className='font-medium'>Total</span>
          <span className='font-medium text-xl'>€{total}</span>
        </div>

        <p className='text-[#282828c0] py-2'>Estimated shipping time: 2 days</p>
        <Button className='bg-[#282828] text-white w-full mt-3'>Check out</Button>
      </div>

      {/* payment type */}
      <div className='bg-[#F4F4F4] py-11 px-6 w-full my-12'>
        <h3 className='text-xl' >Payment type</h3>
        {/* payment methods */}
        <div className='flex items-center justify-between w-full pb-2 pt-6'>
          <img className='w-12 rounded-sm ' src={visa} alt="Visa" />
          <span className='w-12 h-8 rounded-sm bg-black text-[8px] font-montserrat text-white text-wrap flex items-center justify-center'><img className='w-6 object-contain' src={maestro} alt="Maestro" /></span>
          <span className='w-12 h-8 rounded-sm bg-black text-[8px] font-montserrat text-white text-wrap flex items-center justify-center'><img className='w-6 object-contain' src={mastercard} alt="MasterCard" /></span>
          <span className='w-12 h-8 rounded-sm bg-black text-[8px] font-montserrat text-white text-wrap flex items-center justify-center'><img className='w-6 object-contain' src={ideal} alt="iDEAL" /></span>
          <span className='w-12 h-8 rounded-sm bg-black text-[8px] font-montserrat text-white text-wrap flex items-center justify-center text-center font-semibold'> advace payment</span>
        </div>
      </div>

      {/*  Delivery and retour */}
      <div className='bg-[#F4F4F4] py-11 px-6 w-full mt-12'>
        <h3 className='text-xl' >Delivery and retour</h3>
        {/* sub total */}
        <div className='w-full flex flex-col gap-4 pb-2 pt-6'>
          <di className='flex items-start gap-2'>
            <span> <ChevronRightIcon size={16} /> </span>
            <p className='text-sm'>Order before 12:00 and we will ship the same day.</p>
          </di>
          <di className='flex items-start gap-2'>
            <span> <ChevronRightIcon size={16} /> </span>
            <p className='text-sm'>Orders made after Friday 12:00 are processed on Monday.</p>
          </di>
          <di className='flex items-start gap-2'>
            <span> <ChevronRightIcon size={16} /> </span>
            <p className='text-sm'>To return your articles, please contact us first.</p>
          </di>
          <di className='flex items-start gap-2'>
            <span> <ChevronRightIcon size={16} /> </span>
            <p className='text-sm'>Postal charges for retour are not reimbursed.</p>
          </di>
        </div>
      </div>
    </div>
  )
}

export default React.memo(OrderSummary)