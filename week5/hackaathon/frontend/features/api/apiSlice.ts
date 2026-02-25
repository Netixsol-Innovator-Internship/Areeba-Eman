import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ----- Type Definitions -----
export interface User {
  _id: string;
  username: string;
  fullName?: string;
  email?: string;
  mobileNumber?: string;
  nationality?: string;
  idType?: string;
  idNo?: string;
  address1?: string;
  address2?: string;
  city?: string;
  country?: string;
  landline?: string;
  poBox?: string;
  trafficInformationType?: string;
  trafficFileNo?: string;
  plateState?: string;
  plateCode?: string;
  plateNumber?: string;
  driverLicenseNumber?: string;
  issueCity?: string;
  myCars?: string[];
  myBids?: string[];
  wishlist?: string[];
  role?: string;
}

// Car and Bid types
export interface Car {
  // bids: number;
  id: string;
  model: string;
  company: string;
  currentBid: number;
  maxBid?: number;
  image: string;
  photos?: string[];
  year: number;
  status?: string;
  mileage?: number;
  paint?: string;
  createdAt: string;
  bids?: Bid[];
}

export interface Bid {
  _id: string;
  amount: number;
  user: {
    _id?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    nationality?: string;
    city?: string;
  };
}

// ----- API Slice -----
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Cars", "Bids", "Users", "Notifications"],
  endpoints: (builder) => ({
    // -------- Cars --------
    getCars: builder.query<any[], Record<string, string>>({
      query: (filters) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
        return `/cars?${params.toString()}`;
      },
      transformResponse: (response: any[]) =>
        response.map((car) => ({
          id: car._id,
          model: car.model,
          company: car.make,
          currentBid: car.maxBid,
          image: car.photos?.length
            ? process.env.NEXT_PUBLIC_API_URL + car.photos[0]
            : "/default-car.jpg",
          year: car.year,
          status: car.status,
          mileage: car.mileage,
          paint: car.paint,
          createdAt: car.createdAt,
        })),
      providesTags: ["Cars"],
    }),

    getCarById: builder.query<Car, string>({
      query: (id) => `/cars/${id}`,
      transformResponse: (car: any) => ({
        id: car._id,
        model: car.model,
        company: car.make,
        currentBid: car.maxBid,
        maxBid: car.maxBid,
        image: car.photos?.length
          ? process.env.NEXT_PUBLIC_API_URL + car.photos[0]
          : "/default-car.jpg",
        photos: car.photos,
        paint: car.paint,
        mileage: car.mileage,
        createdAt: car.createdAt,
        year: car.year,
        bids: car.bids || [],
      }),
      providesTags: ["Cars"],
    }),

    submitBid: builder.mutation<void, { carId: string; amount: number }>({
      query: ({ carId, amount }) => ({
        url: `/cars/${carId}/bid`,
        method: "POST",
        body: { amount },
      }),
      invalidatesTags: ["Cars"],
    }),

    // -------- Bids --------
    getBids: builder.query<Bid[], string>({
      query: (carId) => `/bids/car/${carId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map((bid) => ({ type: "Bids" as const, id: bid._id })),
              { type: "Bids", id: "LIST" },
            ]
          : [{ type: "Bids", id: "LIST" }],
    }),

    createBid: builder.mutation<void, { carId: string; amount: number }>({
      query: ({ carId, amount }) => ({
        url: `/bids`,
        method: "POST",
        body: { carId, amount },
      }),
      invalidatesTags: ["Bids", "Cars"],
    }),

    // -------- Users --------
    getProfile: builder.query<User, void>({
      query: () => "/users/profile",
      providesTags: ["Users"],
    }),

    updateProfile: builder.mutation<User, Partial<User>>({
      query: (data: Partial<User>) => ({
        url: "/users/profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),
    addToWishlist: builder.mutation<User, string>({
  query: (carId) => ({
    url: `/users/wishlist/${carId}`,
    method: "POST",
  }),
  invalidatesTags: ["Users", "Cars"],
}),

removeFromWishlist: builder.mutation<User, string>({
  query: (carId) => ({
    url: `/users/wishlist/${carId}`,
    method: "DELETE",
  }),
  invalidatesTags: ["Users", "Cars"],
}),

getNotifications: builder.query({
  query: () => "/notifications",
  providesTags: ["Notifications"],
}),

markNotificationRead: builder.mutation({
  query: (id) => ({
    url: `/notifications/${id}/read`,
    method: "POST",
  }),
  invalidatesTags: ["Notifications"],
}),
  }),
});

// ----- Export hooks -----
export const {
  useGetCarsQuery,
  useGetCarByIdQuery,
  useSubmitBidMutation,
  useGetBidsQuery,
  useCreateBidMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
} = api;
