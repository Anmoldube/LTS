// axiosInstance.js
import axios from "axios";
import { useNavigate } from "react-router-dom";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const navigate = useNavigate();
      navigate("/login");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
