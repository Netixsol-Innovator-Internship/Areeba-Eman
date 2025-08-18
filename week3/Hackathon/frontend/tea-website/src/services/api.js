import axios from "axios";

// Create an Axios instance
const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`, // your backend URL from .env
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, 
});

// Request interceptor to attach JWT
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Optional: Response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // You can handle 401 globally, e.g., redirect to login
        return Promise.reject(error);
    }
);

export default api;
