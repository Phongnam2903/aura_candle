import axios from "axios";

export async function registerUser(payload) {
  // payload = { name, gender, phone, email, password }
  const res = await axios.post("http://localhost:5000/auth/register", payload);
  return res.data;
}

export async function loginUser(payload) {
  // payload = { email, password }
  const res = await axios.post("http://localhost:5000/auth/login", payload);
  return res.data; // backend trả về token, user info,...
}