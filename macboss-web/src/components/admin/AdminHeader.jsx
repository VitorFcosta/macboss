import { Link } from 'react-router-dom';

export default function AdminHeader({ title, subtitle }) {
  const today = new Date().toLocaleDateString('pt-BR', { 
    day: '2-digit', month: 'short', year: 'numeric' 
  }).toUpperCase();

  return (
    <header className="flex justify-between items-center border-b border-gray-200 pb-6 mb-8">
      
      <div className="flex items-center gap-6">
        <Link to="/dashboard" className="text-sm font-bold tracking-widest uppercase hover:text-gray-500 transition-colors">
          &larr; PAINEL
        </Link>
        <div className="h-6 w-[1px] bg-gray-300"></div>
        <h1 className="font-['Bebas_Neue'] text-4xl tracking-wider pt-2">
          {title} {subtitle && <span className="text-gray-400">({subtitle})</span>}
        </h1>
      </div>

      <div className="flex items-center gap-6 text-xs font-bold tracking-widest text-gray-400 uppercase">
        <span>{today}</span>
        <div className="flex items-center gap-2 text-green-500">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          PAINEL ATIVO
        </div>
      </div>

    </header>
  );
}
