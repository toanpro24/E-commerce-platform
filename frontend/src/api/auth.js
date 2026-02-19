import api from "./client";

export const loginUser = (username, password) =>
  api.post("/auth/login", { username, password }).then((r) => r.data);

export const registerUser = (data) =>
  api.post("/auth/register", data).then((r) => r.data);

export const getMe = () =>
  api.get("/auth/me").then((r) => r.data);

export const updateMe = (data) =>
  api.put("/auth/me", data).then((r) => r.data);
