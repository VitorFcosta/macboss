import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  // Aguarda o /me responder antes de decidir
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-black"></div>
      </div>
    );
  }

  // Não está logado → vai para o login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Está logado mas não é admin → vai para home
  if (user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  // É admin → pode entrar
  return children;
}
