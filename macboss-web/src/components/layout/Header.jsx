import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--color-bg-primary)] border-b border-[var(--color-border-default)]">
      {/* === BARRA PRINCIPAL === */}
      <div className="relative flex items-center justify-between px-6 h-14">

        {/* ESQUERDA — Nav links (desktop) + Hamburger (mobile) */}
        <nav className="flex items-center gap-6">
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/loja" className="text-xs font-medium uppercase tracking-widest hover:opacity-60 transition-opacity">Loja</NavLink>
            <NavLink to="/colecoes" className="text-xs font-medium uppercase tracking-widest hover:opacity-60 transition-opacity">Coleções</NavLink>
          </div>
        </nav>

        {/* CENTRO — Logo (absolutamente centralizado) */}
        <Link
          to="/"
          className="absolute left-1/2 -translate-x-1/2 font-['Bebas_Neue'] text-2xl tracking-tight leading-none"
        >
          MACBOSS
        </Link>

        {/* DIREITA — Ícones */}
        <div className="flex items-center gap-4">
          <button aria-label="Buscar"><Search size={18} strokeWidth={1.5} /></button>
          <Link to="/carrinho" className="relative" aria-label="Carrinho">
            <ShoppingBag size={18} strokeWidth={1.5} />
          </Link>
        </div>

      </div>

      {/* === MENU MOBILE === */}
      {menuOpen && (
        <nav className="md:hidden flex flex-col border-t border-[var(--color-border-default)] px-6 py-4 gap-4">
          <NavLink to="/loja" className="text-sm font-medium uppercase tracking-widest">Loja</NavLink>
          <NavLink to="/colecoes" className="text-sm font-medium uppercase tracking-widest">Coleções</NavLink>
        </nav>
      )}
    </header>
  );
}
