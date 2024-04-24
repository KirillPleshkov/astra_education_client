import axios from "axios";
import { fetchRefreshToken } from "../api/Token/FetchRefreshToken";
import { useNavigate } from "react-router-dom";

const useAxios = () => {
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: "/api",
  });

  // Add a request interceptor
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem("refreshToken");
          const response = await fetchRefreshToken({ refresh: refreshToken });
          const { access } = response.data;

          localStorage.setItem("accessToken", access);

          originalRequest.headers.Authorization = `Bearer ${access}`;
          return axios(originalRequest);
        } catch (error) {
          navigate("/login");
        }
      }

      return Promise.reject(error);
    }
  );

  return { api };
};

export default useAxios;
