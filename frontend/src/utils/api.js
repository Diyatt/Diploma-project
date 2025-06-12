import axios from 'axios';

const api = axios.create({
  baseURL:'https://arent-production.up.railway.app' + '/api',
  withCredentials: true,  // Егер куки қажет болса
});

// 🔒 Токенді хедерге қосу
api.interceptors.request.use(
  config => {
    const userToken = localStorage.getItem('userData');
    if (userToken) {
      const { token } = JSON.parse(userToken);
      config.headers.Authorization = `Bearer ${token}`;  // << Түзетілді
    }
    return config;
  },
  error => Promise.reject(error)
);

// 🔁 Refresh logic
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const userToken = localStorage.getItem('userData');
        const parsed = JSON.parse(userToken);
        const refreshToken = parsed.refresh;

        // ✅ жаңа instance
        const refreshResponse = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/token/refresh/`, {
          refresh: refreshToken
        });

        const newAccessToken = refreshResponse.data.access;
        parsed.token = newAccessToken;
        localStorage.setItem('userData', JSON.stringify(parsed));

        api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.error('🔁 Refresh error:', refreshError);
        localStorage.removeItem("userData");
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
