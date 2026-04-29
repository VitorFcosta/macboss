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

// Interceptor de resposta: renova o token automaticamente quando recebe 401
api.interceptors.response.use(
  // Sucesso (2xx): deixa passar sem interferir
  (response) => response,

  // Erro: nossa lógica de renovação entra aqui
  async (error) => {
    const originalRequest = error.config;

    // Tenta refresh APENAS se:
    // 1. O erro foi 401 (não autorizado)
    // 2. A requisição que falhou NÃO era o próprio /refresh (evita loop infinito)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post('/auth/refresh');
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
