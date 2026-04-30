import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Enquanto espera a resposta do /me, mostra um loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-primary)]">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-black"></div>
      </div>
    );
  }
  // Se o backend respondeu que não tem usuário, chuta pro login!
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se ele for legítimo, renderiza o componente que está "dentro" dele
  return children;
}
