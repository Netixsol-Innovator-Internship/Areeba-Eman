import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const productsApi = createApi({
    reducerPath: 'products',
    baseQuery: fetchBaseQuery({baseUrl: "https://dummyjson.com"}),
    endpoints: (builder) => ({
        // getting all products eading data by query method
        getAllProducts: builder.query({
            query: () => '/products'
        })
    })
})

export const {useGetAllProductsQuery} = productsApi;
