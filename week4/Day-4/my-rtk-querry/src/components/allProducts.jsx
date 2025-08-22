import React from 'react'
import {useGetAllProductsQuery} from '../app/service/dummyData';

const AllProducts = () => {
    const res = useGetAllProductsQuery()
    console.log(res)
  return (
    <div>
        products
    </div>
  )
}

export default AllProducts