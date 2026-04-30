import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';
import { Button, Input } from '../components/ui';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'E-mail ou senha inválidos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout headlineTop="BEM-VINDO" headlineBottom="DE VOLTA.">
      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
        Conta Mac Boss
      </p>
      <h1 className="mb-8 font-['Bebas_Neue'] text-6xl leading-none text-[var(--color-text-primary)]">
        ENTRAR
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="border-l-2 border-[var(--color-error)] bg-[var(--color-bg-elevated)] px-4 py-3 text-sm text-[var(--color-error)]">
            {error}
          </div>
        )}

        <Input
          id="login-email" label="Email" type="email"
          value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="o_teu@email.com" required
        />

        <Input
          id="login-password" label="Palavra-Passe"
          type={showPassword ? 'text' : 'password'}
          value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••" required
          topRightSlot={
            <button type="button" className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
              Esqueceste?
            </button>
          }
          rightSlot={
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />

        <Button isLoading={isLoading} loadingText="ENTRANDO...">
          ENTRAR <ArrowRight className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-[var(--color-border-default)]" />
          <span className="text-xs uppercase tracking-widest text-[var(--color-text-tertiary)]">ou</span>
          <div className="h-px flex-1 bg-[var(--color-border-default)]" />
        </div>

        <p className="text-center text-sm text-[var(--color-text-secondary)]">
          Ainda sem conta?{' '}
          <Link to="/register" className="font-bold text-[var(--color-text-primary)] underline underline-offset-2 hover:opacity-60 transition-opacity">
            Criar conta
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
