import axios from 'axios';

// Instância base do Axios configurada para o backend MACBOSS
export const api = axios.create({
  // O proxy do Vite redireciona para localhost:8080 automaticamente
  baseURL: '/api/v1',
  // Envia e recebe cookies em todas as requisições (JWT HttpOnly)
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor de resposta: renova o token automaticamente quando recebe 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Evita loop infinito se o próprio refresh der 401
    if (originalRequest.url === '/auth/refresh') {
      return Promise.reject(error);
    }

    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      if (isRefreshing) {
        // Se já tem um refresh acontecendo, coloca na fila
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        api.post('/auth/refresh')
          .then(() => {
            processQueue(null);
            resolve(api(originalRequest));
          })
          .catch((refreshError) => {
            processQueue(refreshError);
            window.location.href = '/login';
            reject(refreshError);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);
