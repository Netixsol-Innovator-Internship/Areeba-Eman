import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { logout } from '../authSlice'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://192.168.18.96:4000',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      headers.set('Content-Type', 'application/json')
      return headers
    },
  }),
  tagTypes: ['Users', 'Products', 'Orders', 'Ratings', 'Carts'],
  endpoints: (builder) => ({
    // AUTH
    signup: builder.mutation({
      query: (body) => ({ url: '/auth/signup', method: 'POST', body }),
    }),
    verifyOtp: builder.mutation({
      query: (body) => ({ url: '/auth/verify', method: 'POST', body }),
    }),
    resendOtp: builder.mutation({
      query: (body) => ({ url: '/auth/resend-otp', method: 'POST', body }),
    }),
    login: builder.mutation({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),
    profile: builder.query({
      query: () => '/users/me',
    }),

    getProducts: builder.query({
    query: (params) => {
      const query = new URLSearchParams(params).toString()
      return `/products${query ? `?${query}` : ''}`
    },
  }),
  getProductById: builder.query({
    query: (id) => `/products/${id}`,
  }),
    // USERS
  getUsers: builder.query({
    query: () => '/users',
    transformResponse: (response) => {
      console.log('Raw /users response:', response);

      // Try to find the array of users
      if (Array.isArray(response)) return response;       // if response is directly an array
      if (response?.items && Array.isArray(response.items)) return response.items; // if response.items exists
      if (response?.users && Array.isArray(response.users)) return response.users; // if response.users exists
      if (response?.data && Array.isArray(response.data)) return response.data;    // if response.data exists

      // fallback to empty array
      console.warn('No users array found in /users response.');
      return [];
    },
    providesTags: ['Users'],
  }),

  updateUserRole: builder.mutation({
    query: ({ id, roles }) => ({
      url: `/admin/users/${id}/roles`,
      method: 'PATCH',
      body: { roles },
    }),
    invalidatesTags: ['Users'],
  }),

  createProduct: builder.mutation({
  query: (body) => ({
    url: '/products',
    method: 'POST',
    body,
  }),
  invalidatesTags: ['Products'],
  }),
  updateProduct: builder.mutation({
  query: ({ id, body }) => ({
    url: `/products/${id}`,
    method: 'PATCH',
    body,
  }),
  invalidatesTags: ['Products'],
 }),
  setProductSale: builder.mutation({
    query: ({ id, body }) => ({
      url: `/products/${id}/sales`,
      method: 'PATCH',
      body,
    }),
    invalidatesTags: ['Products'],
  }),
  
    // Fetch all orders, optionally filter by status
    getOrders: builder.query({
      query: ({ status } = {}) => ({
        url: '/orders/recent',
        params: status ? { status } : {},
      }),
      providesTags: ['Orders'],
    }),

    // Fetch single order by ID
    getOrderById: builder.query({
      query: (orderId) => `/orders/${orderId}`,
      providesTags: ['Orders'],
    }),

    // Update order status
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `/orders/${orderId}/status/${status}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Orders'],
    }),
    // RATINGS
    getProductRatings: builder.query({
    query: (productId) => `/ratings/${productId}/list`,
    providesTags: (result, error, productId) =>
      result
        ? [
            ...result.map((r) => ({ type: 'Ratings', id: r._id })),
            { type: 'Products', id: productId },
          ]
        : [{ type: 'Products', id: productId }],
  }),

    getAllReviews: builder.query({
    query: () => '/ratings',
  }),

  // inside endpoints builder (add these)
getCart: builder.query({
  query: () => '/carts/mine',
  providesTags: (result) =>
    result
      ? [
          ...result.items.map((it) => ({ type: 'Products', id: it.productId })),
          { type: 'Carts', id: 'MINE' },
        ]
      : [{ type: 'Carts', id: 'MINE' }],
}),

addToCart: builder.mutation({
  // backend: POST /carts/:productId  (adds qty=1)
  query: (productId) => ({
    url: `/carts/${productId}`,
    method: 'POST',
  }),
  invalidatesTags: [{ type: 'Carts', id: 'MINE' }, 'Products'],
}),

changeCartQty: builder.mutation({
  // PATCH /carts/:productId/qty/:qty
  query: ({ productId, qty }) => ({
    url: `/carts/${productId}/qty/${qty}`,
    method: 'PATCH',
  }),
  invalidatesTags: [{ type: 'Carts', id: 'MINE' }, 'Products'],
}),

removeFromCart: builder.mutation({
  // DELETE /carts/:productId
  query: (productId) => ({
    url: `/carts/${productId}`,
    method: 'DELETE',
  }),
  invalidatesTags: [{ type: 'Carts', id: 'MINE' }, 'Products'],
}),

checkout: builder.mutation({
  // POST /orders/checkout
  query: (body) => ({
    url: '/orders/checkout',
    method: 'POST',
    body,
  }),
  invalidatesTags: [{ type: 'Carts', id: 'MINE' }, 'Orders'],
}),


  // Add rating
  addRating: builder.mutation({
    query: ({ productId, stars, comment }) => ({
      url: `/ratings/${productId}`,
      method: 'POST',
      body: { stars, comment },
    }),
    invalidatesTags: (result, error, { productId }) => [
      { type: 'Products', id: productId },
      { type: 'Ratings', id: productId },
    ],
  }),
  }),
  })

export const {
  useSignupMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useLoginMutation,
  useProfileQuery,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useCreateProductMutation,
  useUpdateProductMutation,
  useSetProductSaleMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useGetProductRatingsQuery,
  useAddRatingMutation,
  useGetAllReviewsQuery,
  useGetCartQuery,
  useAddToCartMutation,
  useChangeCartQtyMutation,
  useRemoveFromCartMutation,
  useCheckoutMutation,
} = api
