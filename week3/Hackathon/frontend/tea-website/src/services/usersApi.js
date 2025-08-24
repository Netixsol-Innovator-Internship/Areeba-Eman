import { apiSlice } from './api';

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users',
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((u) => ({ type: 'Users', id: u._id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),
    updateUserRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: `/users/${userId}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'Users', id: userId },
        { type: 'Users', id: 'LIST' },
      ],
    }),
    blockUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}/block`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, userId) => [
        { type: 'Users', id: userId },
        { type: 'Users', id: 'LIST' },
      ],
    }),
    unblockUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}/unblock`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, userId) => [
        { type: 'Users', id: userId },
        { type: 'Users', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useBlockUserMutation,
  useUnblockUserMutation,
} = usersApi;
