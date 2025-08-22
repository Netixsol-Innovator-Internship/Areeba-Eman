import { createSlice } from "@reduxjs/toolkit";

const favouritesSlice = createSlice({
  name: "favourites",
  initialState: [],
  reducers: {
    addFavourite: (state, action) => {
      if (!state.find((item) => item.id === action.payload.id)) {
        state.push(action.payload);
      }
    },
    removeFavourite: (state, action) => {
      return state.filter((item) => item.id !== action.payload);
    },
    clearFavourites: () => [],
  },
});

export const { addFavourite, removeFavourite, clearFavourites } = favouritesSlice.actions;
export default favouritesSlice.reducer;
