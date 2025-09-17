import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes:["Cv", "Users", "auth"],
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => "/users/me",
    }),

    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "/auth/login",
        method: "POST",
        body: { email, password },
      }),
    }),

    signup: builder.mutation({
      query: ({ name, email, password}) => ({
        url: "/auth/register",
        method: "POST",
        body: { name, email, password },
      }),
    }),

    getCvs: builder.query({
    query: () => "/cvs/me",
    }),

    getMyCvs: builder.query({
      query: () => "cvs/me",
      providesTags: ["Cv"],
    }),

    getCv: builder.query({
      query: (id) => `cvs/${id}`,
      providesTags: (result, error, id) => [{ type: "Cv", id }],
    }),

    createCv: builder.mutation({
      query: (data) => ({
        url: "cvs",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cv"],
    }),

    updateCv: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `cvs/${id}`,
        method: "PUT",
        body: data,
      }),
    
    }),

    deleteCv: builder.mutation({
      query: (id) => ({
        url: `cvs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cv"],
    }),

    uploadPhoto: builder.mutation({
      query: ({ id, body }) => ({
        url: `cvs/upload-photo/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Cv", id }],
    }),

    deletePhoto: builder.mutation({
      query: (id) => ({
        url: `cvs/delete-photo/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Cv", id }],
    }),

  }),
});

export const { 
  useGetUserQuery, 
  useLoginMutation, 
  useSignupMutation,
  useGetCvsQuery,
  useGetMyCvsQuery,
  useGetCvQuery,
  useCreateCvMutation,
  useUpdateCvMutation,
  useDeleteCvMutation,
  useUploadPhotoMutation,
  useDeletePhotoMutation,
} = apiSlice;
