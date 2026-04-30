import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-bg-inverse)] text-[var(--color-text-inverse)]">

      {/* ── CORPO: 4 COLUNAS ── */}
      <div className="mx-auto max-w-screen-xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* COL 1 — Marca */}
          <div className="flex flex-col gap-4">
            <span className="font-['Bebas_Neue'] text-3xl tracking-tight leading-none">
              MACBOSS
            </span>
            <p className="text-xs leading-relaxed text-[var(--color-text-tertiary)] max-w-[200px]">
              Streetwear premium.<br /> Produção sob demanda.
            </p>
          </div>

          {/* COL 2 — Loja */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-text-inverse)]">
              Loja
            </h3>
            <nav className="flex flex-col gap-3">
              {[
                { label: 'Novidades', to: '/loja/novidades' },
                { label: 'Camisetas', to: '/loja/camisetas' },
                { label: 'Coleções', to: '/colecoes' },
                { label: 'Mais vendidos', to: '/loja/mais-vendidos' },
              ].map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-xs text-[var(--color-text-tertiary)] uppercase tracking-wider transition-colors hover:text-[var(--color-text-inverse)]"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* COL 3 — Informações */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-text-inverse)]">
              Informações
            </h3>
            <nav className="flex flex-col gap-3">
              {[
                { label: 'Sobre nós', to: '/sobre' },
                { label: 'Como funciona', to: '/como-funciona' },
                { label: 'Trocas e devoluções', to: '/trocas' },
                { label: 'Guia de tamanhos', to: '/tamanhos' },
              ].map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-xs text-[var(--color-text-tertiary)] uppercase tracking-wider transition-colors hover:text-[var(--color-text-inverse)]"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* COL 4 — Contato */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-text-inverse)]">
              Contato
            </h3>
            <nav className="flex flex-col gap-3">
              {[
                { label: 'Suporte', to: '/suporte' },
                { label: 'FAQ', to: '/faq' },
                { label: 'Termos de uso', to: '/termos' },
                { label: 'Privacidade', to: '/privacidade' },
              ].map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-xs text-[var(--color-text-tertiary)] uppercase tracking-wider transition-colors hover:text-[var(--color-text-inverse)]"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

        </div>
      </div>

      {/* ── RODAPÉ: COPYRIGHT ── */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-screen-xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]">
            © {year} MACBOSS. Todos os direitos reservados.
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]">
            Produção sob demanda — Brasil
          </p>
        </div>
      </div>

    </footer>
  );
}
