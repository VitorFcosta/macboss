import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Rota exclusiva para visitantes (não logados)
// Se o usuário JÁ está logado, manda direto pro Dashboard
export default function GuestRoute({ children }) {
  const { user, loading } = useAuth();

  // Enquanto verifica o cookie, não renderiza nada (evita flash de tela)
  if (loading) return null;

  // Já está logado? Vai pro Dashboard
  if (user) return <Navigate to="/dashboard" replace />;

  // Não está logado? Mostra a página normalmente (Login ou Register)
  return children;
}
