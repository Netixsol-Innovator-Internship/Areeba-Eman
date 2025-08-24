import { apiSlice } from './api';

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Public
    getCollections: builder.query({
      query: () => '/collections',
      providesTags: ['Collections'],
    }),
    getProducts: builder.query({
      query: () => '/products',
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((p) => ({ type: 'Product', id: p._id })),
              { type: 'Products', id: 'LIST' },
            ]
          : [{ type: 'Products', id: 'LIST' }],
    }),
    getProductBySlug: builder.query({
      query: (slug) => `/products/slug/${slug}`,
      providesTags: (result) =>
        result?.data?._id
          ? [{ type: 'Product', id: result.data._id }]
          : ['Products'],
    }),

    // Admin / SuperAdmin
    createProduct: builder.mutation({
      query: (formData) => ({
        url: '/products',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Products', id: 'LIST' }, 'Collections'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/products/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        { type: 'Products', id: 'LIST' },
      ],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Products', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetCollectionsQuery,
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
