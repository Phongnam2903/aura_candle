import api from "../axiosInstance";

export async function registerUser(payload) {
  const res = await api.post("/auth/register", payload);
  return res.data;
}

export async function loginUser(payload) {
  const res = await api.post("/auth/login", payload);
  return res.data;
}

export async function changePassword(payload) {
  const res = await api.post("/auth/change-password", payload);
  return res.data;
}

export async function logoutUser() {
  const res = await api.post("/auth/logout");
  return res.data;
}