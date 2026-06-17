import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { API_URLS } from '../../config';

const BASE_URL = `${API_URLS.BASE}/api`; 

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