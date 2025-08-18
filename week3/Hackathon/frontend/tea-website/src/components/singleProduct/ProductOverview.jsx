import React from 'react'

const ProductOverview = ({children}) => {
  return (
    <section className='md:px-10 lg:px-12 grid md:grid-cols-2 lg:gap-24 gap-8'>
      {children}
    </section>
  )
}

export default ProductOverview
