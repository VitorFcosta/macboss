import { AlertTriangle, Plus, Trash2 } from 'lucide-react';

export default function VariantCard({ variant, onAddStock, onDeactivate }) {
  const available = variant.availableQty ?? (variant.qtyOnHand - (variant.qtyReserved || 0));
  const threshold = variant.lowStockThreshold || 5;
  const isCritical = available <= threshold;

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(variant.price);

  const isActive = variant.active !== false; // assume true se undefined

  return (
    <div className={`bg-white border border-[#E5E5E5] flex flex-col h-full transition-colors duration-200 ${isActive ? 'hover:border-black' : 'opacity-50 grayscale'}`}>

      {/* TOPO — Nome + Badge crítico/inativo */}
      <div className="p-5 border-b border-[#E5E5E5]">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-['DM_Sans'] font-bold text-base uppercase tracking-wider text-black leading-tight">
            {variant.product?.name}
          </h3>
          {!isActive ? (
            <span className="flex items-center gap-1 bg-[#E5E5E5] text-[#999999] text-[10px] font-bold uppercase tracking-wider px-2 py-1 whitespace-nowrap">
              DESATIVADO
            </span>
          ) : isCritical && (
            <span className="flex items-center gap-1 bg-black text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 whitespace-nowrap">
              <AlertTriangle className="w-3 h-3" />
              CRÍTICO
            </span>
          )}
        </div>
        <span className="font-['DM_Sans'] text-xs text-[#999999] tracking-wider">
          {variant.sku}
        </span>
      </div>

      {/* MEIO — Atributos */}
      <div className="p-5 flex-grow grid grid-cols-2 gap-x-4 gap-y-3 content-start">
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#999999] mb-0.5">Cor</span>
          <span className="font-['DM_Sans'] text-sm font-bold text-black">{variant.color}</span>
        </div>
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#999999] mb-0.5">Tamanho</span>
          <span className="font-['DM_Sans'] text-sm font-bold text-black">{variant.size}</span>
        </div>
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#999999] mb-0.5">Preço Unit.</span>
          <span className="font-['DM_Sans'] text-sm font-bold text-black">{formattedPrice}</span>
        </div>
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#999999] mb-0.5">Tipo</span>
          <span className="font-['DM_Sans'] text-sm font-bold text-black">{variant.product?.type || '—'}</span>
        </div>
      </div>

      {/* BASE — Estoque + Ações */}
      <div className="grid grid-cols-[1fr_auto_auto] border-t border-[#E5E5E5] mt-auto">

        {/* Contador */}
        <div className="p-4 flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#999999]">ESTOQUE</span>
          <span
            className="font-['Bebas_Neue'] text-4xl leading-none"
            style={{ color: !isActive ? '#999999' : (isCritical ? '#CC0000' : '#000000') }}
          >
            {available}
          </span>
          <span className="text-[10px] text-[#999999]">/ mín. {threshold}</span>
        </div>

        {/* Repor */}
        <button
          onClick={() => isActive && onAddStock && onAddStock(variant)}
          title={isActive ? "Repor estoque" : "Não disponível"}
          disabled={!isActive}
          className={`px-4 flex items-center gap-2 border-l border-[#E5E5E5] bg-white transition-colors duration-200 ${isActive ? 'hover:bg-black hover:text-white cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
        >
          <Plus className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-[0.15em]">Repor</span>
        </button>

        {/* Desativar */}
        <button
          onClick={() => isActive && onDeactivate && onDeactivate(variant)}
          title={isActive ? "Desativar variante" : "Já desativada"}
          disabled={!isActive}
          className={`px-4 flex items-center border-l border-[#E5E5E5] bg-white transition-colors duration-200 ${isActive ? 'hover:bg-[#CC0000] hover:text-white cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}
