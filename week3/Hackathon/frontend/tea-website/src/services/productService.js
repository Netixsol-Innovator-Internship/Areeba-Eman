import api from "./api";

export const getAllProducts = async () => {
  try {
    const res = await api.get("/products");
    return res.data;
  } catch (error) {
    return error?.response;
  }
};

export const getAllCollections = async () => {
  try {
    const res = await api.get("/products/collections");
    return res.data;
  } catch (error) {
    return error?.response;
  }
};

export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

export const getProductBySlug = async (slug) => {
  try {
    const res = await api.get(`/products/slug/${slug}`);
    return res.data;
  } catch (error) {
    return error?.response;
  }
};

export const getFilterOptions = async () => {
  try {
    const res = await api.get("/products/filters/options");
    return res.data;
  } catch (error) {
    return error?.response;
  }
};

export const getFilteredProducts = async (filters) => {
  try {
    const res = await api.get("/products/filter/search", { params: filters });
    return res.data;
  } catch (error) {
    return error?.response;
  }
};

export const createProduct = async (formData) => {
  const res = await api.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateProduct = async (formData) => {
  const res = await api.put("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

export const deleteAllProducts = async () => {
  const res = await api.delete("/products");
  return res.data;
};
