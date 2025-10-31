// src/lib/fetchUtil.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL, // 🔥 Gọi đến route nội bộ của Next.js
});

api.interceptors.request.use((config) => {
  console.log('Request →', config.url);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error →', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const fetchData = async <T>(path: string, params?: any): Promise<T> => {
  const response = await api.get(path, { params });
  return response.data;
};
