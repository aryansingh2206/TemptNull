import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api", // ✅ your backend port
});

// Attach token automatically to all requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 👉 Function to fetch impulses
export const fetchImpulses = async () => {
  const res = await API.get("/impulses");
  return res.data;
};

export default API;
