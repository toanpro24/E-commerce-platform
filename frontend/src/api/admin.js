import api from "./client";

export const adminGetProducts = (params = {}) =>
  api.get("/admin/products", { params }).then((r) => r.data);

export const adminCreateProduct = (data) =>
  api.post("/admin/products", data).then((r) => r.data);

export const adminUpdateProduct = (id, data) =>
  api.put(`/admin/products/${id}`, data).then((r) => r.data);

export const adminDeleteProduct = (id) =>
  api.delete(`/admin/products/${id}`).then((r) => r.data);

export const adminGetOrders = (params = {}) =>
  api.get("/admin/orders", { params }).then((r) => r.data);

export const adminUpdateOrderStatus = (id, status) =>
  api.put(`/admin/orders/${id}/status`, { status }).then((r) => r.data);

export const adminGetCustomers = () =>
  api.get("/admin/customers").then((r) => r.data);
