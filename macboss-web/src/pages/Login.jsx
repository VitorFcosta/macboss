import { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';



export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); 



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Comunicação direta com nosso Backend Spring Boot via Axios
      const response = await login(email, password);
      await checkAuth();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'E-mail ou senha inválidos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-50">
      {/* Lado Esquerdo - Decorativo (Oculto no Celular) */}
      <div className="relative hidden w-1/2 overflow-hidden bg-zinc-900 lg:block">
        {/* Efeitos de Luz Premium no fundo escuro */}
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-primary-600/20 to-zinc-900" />
        <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        
        <div className="relative z-20 flex h-full flex-col justify-center p-20">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-white">
            Gestão Inteligente <br />para a sua Assistência.
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-zinc-400">
            O MACBOSS centraliza todas as operações técnicas e administrativas em um único painel ágil e poderoso.
          </p>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="flex w-full flex-col justify-center px-8 sm:px-16 md:px-24 lg:w-1/2">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
              Acesso Restrito
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Insira suas credenciais para acessar o sistema
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="animate-pulse rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                E-mail
              </label>
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400 transition-colors group-focus-within:text-primary-500">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-zinc-200 bg-white py-3 pl-10 pr-4 text-zinc-900 transition-all placeholder:text-zinc-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10"
                  placeholder="admin@macboss.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-zinc-700">
                  Senha
                </label>
              </div>
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
                    Entrar no Painel
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </button>
                        <div className="mt-4 text-center text-sm text-zinc-600">
              Não tem uma conta?{' '}
              <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-500">
                Cadastre-se grátis
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
  
}
