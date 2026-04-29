import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-[var(--color-border-default)] mt-auto">
      <div className="max-w-screen-xl mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

        {/* Logo */}
        <span className="font-['Bebas_Neue'] text-2xl leading-none tracking-tight">
          MAC BOSS
        </span>

        {/* Links */}
        <nav className="flex flex-wrap gap-6">
          <Link to="/loja" className="text-xs uppercase tracking-widest font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
            Loja
          </Link>
          <Link to="/colecoes" className="text-xs uppercase tracking-widest font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
            Coleções
          </Link>
          <Link to="/sobre" className="text-xs uppercase tracking-widest font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
            Sobre
          </Link>
        </nav>

        {/* Copyright */}
        <p className="text-xs text-[var(--color-text-tertiary)] uppercase tracking-widest">
          © {year} Mac Boss. Todos os direitos reservados.
        </p>

      </div>
    </footer>
  );
}
