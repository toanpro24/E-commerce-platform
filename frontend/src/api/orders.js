import api from "./client";

export const checkout = () =>
  api.post("/orders/checkout").then((r) => r.data);

export const getMyOrders = () =>
  api.get("/orders/my-orders").then((r) => r.data);

export const getOrder = (id) =>
  api.get(`/orders/${id}`).then((r) => r.data);
