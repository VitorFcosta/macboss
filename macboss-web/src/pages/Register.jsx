import { useState } from 'react';
import { User, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [lgpdConsent, setLgpdConsent] = useState(false);
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate(); 
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!lgpdConsent) {
      setError("Você precisa aceitar os Termos de Uso e LGPD.");
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
    <div className="flex min-h-screen bg-zinc-50">
      <div className="relative hidden w-1/2 overflow-hidden bg-zinc-900 lg:block">
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-primary-600/20 to-zinc-900" />
        <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        
        <div className="relative z-20 flex h-full flex-col justify-center p-20">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-white">
            O futuro da sua <br />Assistência Técnica.
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-zinc-400">
            Junte-se ao MACBOSS e tenha controle absoluto sobre O.S., orçamentos e clientes.
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col justify-center px-8 sm:px-16 md:px-24 lg:w-1/2">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
              Crie sua conta
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Comece a gerenciar seu negócio em segundos
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="animate-pulse rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">Nome Completo</label>
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400 transition-colors group-focus-within:text-primary-500">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-xl border border-zinc-200 bg-white py-3 pl-10 pr-4 text-zinc-900 transition-all placeholder:text-zinc-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10"
                  placeholder="Seu nome"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">E-mail</label>
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400 transition-colors group-focus-within:text-primary-500">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-zinc-200 bg-white py-3 pl-10 pr-4 text-zinc-900 transition-all placeholder:text-zinc-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10"
                  placeholder="contato@empresa.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">Senha Segura</label>
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400 transition-colors group-focus-within:text-primary-500">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-zinc-200 bg-white py-3 pl-10 pr-4 text-zinc-900 transition-all placeholder:text-zinc-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Checkbox LGPD (Exigência do Notion) */}
            <div className="flex items-start gap-3 rounded-lg border border-zinc-100 bg-zinc-50 p-4">
              <div className="flex h-5 items-center">
                <input
                  id="lgpd"
                  type="checkbox"
                  checked={lgpdConsent}
                  onChange={(e) => setLgpdConsent(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 text-primary-600 focus:ring-primary-600"
                />
              </div>
              <label htmlFor="lgpd" className="text-xs leading-relaxed text-zinc-600">
                <span className="flex items-center gap-1 font-semibold text-zinc-900"><ShieldCheck className="h-4 w-4 text-green-600"/> Proteção de Dados (LGPD)</span>
                Declaro que li e concordo com os Termos de Uso e a Política de Privacidade. Autorizo o processamento dos meus dados para fins de acesso à plataforma.
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-xl bg-zinc-900 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-zinc-900/10 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="flex items-center gap-2">
                {isLoading ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></span>
                ) : (
                  <>
                    Criar Conta
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </button>
            
            <div className="mt-4 text-center text-sm text-zinc-600">
              Já tem uma conta?{' '}
              <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500">
                Fazer login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
