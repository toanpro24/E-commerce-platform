import api from "./client";

export const getAdminProducts = (params = {}) =>
  api.get("/admin/products", { params }).then((r) => r.data);

export const createProduct = (data) =>
  api.post("/admin/products", data).then((r) => r.data);

export const updateProduct = (id, data) =>
  api.put(`/admin/products/${id}`, data).then((r) => r.data);

export const deleteProduct = (id) =>
  api.delete(`/admin/products/${id}`).then((r) => r.data);

export const getAdminOrders = (params = {}) =>
  api.get("/admin/orders", { params }).then((r) => r.data);

export const updateOrderStatus = (id, status) =>
  api.put(`/admin/orders/${id}/status`, { status }).then((r) => r.data);

export const getAdminCustomers = () =>
  api.get("/admin/customers").then((r) => r.data);
