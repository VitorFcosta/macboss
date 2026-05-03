import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { AuthContext } from './auth-context';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCurrentUser = useCallback(async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Função que checa silenciosamente se os cookies valem
  const checkAuth = useCallback(async () => {
    await loadCurrentUser();
  }, [loadCurrentUser]);

  useEffect(() => {
    let active = true;

    async function loadAuthState() {
      try {
        const response = await api.get('/auth/me');
        if (active) {
          setUser(response.data);
        }
      } catch {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadAuthState();

    return () => {
      active = false;
    };
  }, []);

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
