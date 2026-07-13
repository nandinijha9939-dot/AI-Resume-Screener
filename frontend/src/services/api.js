import axios from "axios";

const api = axios.create({
  baseURL: "https://ai-resume-screener-backend-u59v.onrender.com",
});

export default api;