import axios from "axios";
import { Platform } from "react-native";

const BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:4000/api"
    : "http://192.168.0.101:4000/api"; 

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export default api;
