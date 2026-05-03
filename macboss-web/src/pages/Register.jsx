import { useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';
import { Button, Input } from '../components/ui';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [lgpdConsent, setLgpdConsent] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!lgpdConsent) {
      setError('Você precisa aceitar os Termos de Uso e a LGPD.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await register(name, email, password, lgpdConsent);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout headlineTop="VESTE QUEM" headlineBottom="VOCÊ É.">
      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
        Nova conta
      </p>
      <h1 className="mb-8 font-['Bebas_Neue'] text-6xl leading-none text-[var(--color-text-primary)]">
        CADASTRO
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="border-l-2 border-[var(--color-error)] bg-[var(--color-bg-elevated)] px-4 py-3 text-sm text-[var(--color-error)]">
            {error}
          </div>
        )}

        <Input
          id="register-name" label="Nome Completo" type="text"
          value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome" required
        />

        <Input
          id="register-email" label="Email" type="email"
          value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="o_teu@email.com" required
        />

        <Input
          id="register-password" label="Palavra-Passe"
          type={showPassword ? 'text' : 'password'}
          value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 8 caracteres" required
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />

        {/* LGPD */}
        <div className="flex items-start gap-3 pt-1">
          <input
            id="lgpd"
            type="checkbox"
            checked={lgpdConsent}
            onChange={(e) => setLgpdConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-black"
          />
          <label htmlFor="lgpd" className="text-xs leading-relaxed text-[var(--color-text-secondary)]">
            <span className="mb-0.5 flex items-center gap-1 font-bold uppercase tracking-wide text-[var(--color-text-primary)]">
              <ShieldCheck className="h-3.5 w-3.5" /> LGPD
            </span>
            Li e aceito os{' '}
            <Link to="/termos" className="underline underline-offset-2">
              Termos de Uso
            </Link>{' '}
            e a Política de Privacidade.
          </label>
        </div>

        <Button isLoading={isLoading} loadingText="CRIANDO...">
          CRIAR CONTA <ArrowRight className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-[var(--color-border-default)]" />
          <span className="text-xs uppercase tracking-widest text-[var(--color-text-tertiary)]">ou</span>
          <div className="h-px flex-1 bg-[var(--color-border-default)]" />
        </div>

        <p className="text-center text-sm text-[var(--color-text-secondary)]">
          Já tem conta?{' '}
          <Link
            to="/login"
            className="font-bold text-[var(--color-text-primary)] underline underline-offset-2 hover:opacity-60 transition-opacity"
          >
            Entrar
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
