import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const BASE_URL = "http://172.20.10.4:4000/api"; 

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 40000,
});


api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;