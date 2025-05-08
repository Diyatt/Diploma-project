import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

api.interceptors.request.use(
  config => {
    const userToken = localStorage.getItem('userData');
    if (userToken) {
      const { token } = JSON.parse(userToken);
      config.headers.Authorization = `JWT ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const userToken = localStorage.getItem('userData');
        const refreshToken = JSON.parse(userToken).refresh;
        const response = await axios.post('http://127.0.0.1:8000/auth/token/refresh/', { refresh: refreshToken });
        const newAuthToken = response.data.access;
        const userData = JSON.parse(userToken);
        userData.token = newAuthToken;
        localStorage.setItem('userData', JSON.stringify(userData));
        api.defaults.headers.Authorization = `JWT ${newAuthToken}`;
        originalRequest.headers.Authorization = `JWT ${newAuthToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Ошибка при обновлении токена:', refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
