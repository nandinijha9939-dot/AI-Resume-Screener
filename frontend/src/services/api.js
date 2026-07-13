import axios from "axios";

const api = axios.create({
  baseURL: "/api",  // Uses Vite proxy
  timeout: 30000,
});

export default api;