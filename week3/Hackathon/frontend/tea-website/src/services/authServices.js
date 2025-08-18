import api from "./api";

export const register = async () => {
  try {
    const res = await api.post("/products");
    return res.data;
  } catch (error) {
    return error?.response;
  }
};