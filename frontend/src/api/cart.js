import api from "./client";

export const getCart = () => api.get("/cart/").then((r) => r.data);

export const addToCart = (product_id, quantity = 1) =>
  api.post("/cart/", { product_id, quantity }).then((r) => r.data);

export const updateCartItem = (itemId, quantity) =>
  api.put(`/cart/${itemId}`, { quantity }).then((r) => r.data);

export const removeFromCart = (itemId) =>
  api.delete(`/cart/${itemId}`).then((r) => r.data);

export const clearCart = () => api.delete("/cart/").then((r) => r.data);
