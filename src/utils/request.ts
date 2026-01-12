import axios, {AxiosInstance} from "axios";

/** 创建 axios 实例 */
const request: AxiosInstance = axios.create({
    // CRA 用 process.env.REACT_APP_API_BASE_URL
    baseURL: process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000",
    timeout: 15000, // 15秒超时
    headers: {
        "Content-Type": "application/json",
    },
});

/** 请求拦截器 */
request.interceptors.request.use(
    (config) => {
        // 🔹 可统一加 token（现阶段不需要）
        // const token = localStorage.getItem("token");
        // if (token) config.headers.Authorization = `Bearer ${token}`;

        return config;
    },
    (error) => Promise.reject(error)
);

/** 响应拦截器 */
request.interceptors.response.use(
    (response) => {
        // 直接返回后端返回的 data
        return response.data;
    },
    (error) => {
        console.error("请求错误：", error);
        return Promise.reject(error);
    }
);

export default request;
