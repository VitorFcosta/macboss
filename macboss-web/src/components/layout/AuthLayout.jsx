import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Layout padrão das páginas de autenticação.
 * - Esquerda: foto full-bleed + texto editorial
 * - Direita: formulário centralizado + footer
 *
 * Props:
 * - headlineTop: linha 1 do texto oversized (ex: "BEM-VINDO")
 * - headlineBottom: linha 2 (ex: "DE VOLTA.")
 * - children: conteúdo do formulário (campos, botão, etc.)
 */
export default function AuthLayout({ headlineTop, headlineBottom, children }) {
  return (
    <div className="flex min-h-screen bg-[var(--color-bg-primary)]">

      {/* ── ESQUERDA: FOTO ── */}
      <div className="relative hidden lg:block lg:w-[45%]">
        {/* TODO: trocar pela foto real do ensaio */}
        <img
          src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=1200&auto=format&fit=crop&q=80"
          alt="MACBOSS Streetwear"
          className="absolute inset-0 h-full w-full object-cover grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Logo */}
        <div className="absolute top-8 left-8 z-10">
          <span className="font-['Bebas_Neue'] text-xl tracking-widest text-white">
            MACBOSS
          </span>
        </div>

        {/* Texto editorial */}
        <div className="absolute bottom-10 left-8 z-10">
          <h2 className="font-['Bebas_Neue'] text-6xl leading-none text-white">
            {headlineTop}<br />{headlineBottom}
          </h2>
        </div>
      </div>

      {/* ── DIREITA: FORMULÁRIO ── */}
      <div className="flex w-full lg:w-[55%] flex-col bg-[var(--color-bg-primary)]">

        {/* Link voltar */}
        <div className="flex justify-end p-6">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar à loja
          </Link>
        </div>

        {/* Conteúdo do form */}
        <div className="flex flex-1 flex-col justify-center px-8 sm:px-12 md:px-16">
          <div className="mx-auto w-full max-w-sm">
            {/* Logo mobile */}
            <span className="mb-10 block font-['Bebas_Neue'] text-xl tracking-widest lg:hidden">
              MACBOSS
            </span>
            {children}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 text-center">
          <p className="text-xs text-[var(--color-text-tertiary)]">
            © {new Date().getFullYear()} MACBOSS.{' '}
            <Link to="/termos" className="underline underline-offset-2 transition-colors hover:text-[var(--color-text-primary)]">
              Termos de Serviço
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
