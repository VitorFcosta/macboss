import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função que checa silenciosamente se os cookies valem
  const checkAuth = useCallback(async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // O Gerente de Login
  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    setUser(response.data); // Atualiza o estado global NA HORA
    return response.data;
  };

  // O Gerente de Cadastro
  const register = async (name, email, password, consentGiven) => {
    const response = await api.post('/auth/register', { name, email, password, consentGiven });
    setUser(response.data); // Já loga o cara na hora que cadastra
    return response.data;
  };

  // O Gerente de Saída
  const logout = async () => {
    await api.post('/auth/logout'); // Pede pro Backend destruir os cookies
    setUser(null); // Limpa o estado no React
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
