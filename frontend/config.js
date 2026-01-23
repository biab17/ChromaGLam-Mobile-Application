const BASE_URL = 'http://172.20.10.4:4000'; 
const WEATHER_API_KEY = "715327b45d8574f75adcd6e99f743fbf";

export const API_URLS = {
  LOGIN: `${BASE_URL}/api/auth/login`,
  SIGNUP: `${BASE_URL}/api/auth/signup`,
  ITEMS: `${BASE_URL}/api/items`,
  BASE: BASE_URL,
  WEATHER: WEATHER_API_KEY
};