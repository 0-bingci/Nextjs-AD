import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 可以在这里添加token等
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 直接返回data
    return response.data;
  },
  (error) => {
    // 简单错误处理
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

export default instance;