import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (data) => api.post('/register', data),
  login:    (data) => api.post('/login', data),
  logout:   ()     => { localStorage.removeItem('auth_token'); localStorage.removeItem('auth_user'); },
};

export const userService = {
  getAll: () => api.get('/users'),
};

export const teacherService = {
  create: (data) => api.post('/teacher', data),
  getAll: ()     => api.get('/teachers'),
};

export default api;
