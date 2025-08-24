// src/services/cartServices.js
let cart = [];

export const getCartProducts = () => {
  return cart;
};

export const increaseQuantity = (id) => {
  const item = cart.find((product) => product.id === id);
  if (item) item.quantity += 1;
};

export const decreaseQuantity = (id) => {
  const item = cart.find((product) => product.id === id);
  if (item && item.quantity > 1) item.quantity -= 1;
};

export const removeItemFromCart = (id) => {
  cart = cart.filter((product) => product.id !== id);
};
