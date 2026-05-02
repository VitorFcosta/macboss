import { useState, useEffect } from 'react';
import { X, ArrowDownCircle, ArrowUpCircle, Lock, Unlock } from 'lucide-react';
import { inventoryService } from '../../lib/inventory';

const TYPE_CONFIG = {
  IN:      { label: 'ENTRADA',   icon: ArrowDownCircle, color: '#2D8C3C' },
  CONSUME: { label: 'CONSUMO',   icon: ArrowUpCircle,   color: '#CC0000' },
  RESERVE: { label: 'RESERVA',   icon: Lock,            color: '#E67E22' },
  RELEASE: { label: 'LIBERAÇÃO', icon: Unlock,           color: '#2563EB' },
};

export default function MovementHistoryModal({ variant, onClose }) {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await inventoryService.getMovements(variant.id);
        setMovements(data);
      } catch (err) {
        console.error('Erro ao buscar histórico:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [variant.id]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const formatDate = (iso) => {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white border border-black w-full max-w-lg max-h-[80vh] flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#E5E5E5]">
          <div>
            <h2 id="history-title" className="font-['DM_Sans'] font-bold text-sm uppercase tracking-[0.15em]">
              Histórico de Movimentações
            </h2>
            <p className="text-[10px] text-[#999999] tracking-wider mt-0.5">
              {variant.product?.name} — {variant.sku}
            </p>
          </div>
          <button onClick={onClose} aria-label="Fechar" className="text-[#999999] hover:text-black transition-colors p-1 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p className="p-6 text-[11px] font-bold uppercase tracking-[0.2em] text-[#999999]">
              CARREGANDO...
            </p>
          ) : movements.length === 0 ? (
            <p className="p-6 text-[11px] font-bold uppercase tracking-[0.2em] text-[#999999]">
              Nenhuma movimentação registrada.
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E5E5]">
                  <th className="text-left px-6 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#999999]">Tipo</th>
                  <th className="text-right px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#999999]">Qtd</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#999999]">Observação</th>
                  <th className="text-right px-6 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#999999]">Data</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((m) => {
                  const cfg = TYPE_CONFIG[m.type] || TYPE_CONFIG.IN;
                  const Icon = cfg.icon;
                  return (
                    <tr key={m.id} className="border-b border-[#F0F0F0] hover:bg-[#FAFAFA] transition-colors">
                      <td className="px-6 py-3">
                        <span className="flex items-center gap-2">
                          <Icon size={14} style={{ color: cfg.color }} />
                          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: cfg.color }}>
                            {cfg.label}
                          </span>
                        </span>
                      </td>
                      <td className="text-right px-4 py-3 font-['DM_Sans'] text-sm font-bold text-black">
                        {m.type === 'IN' || m.type === 'RELEASE' ? '+' : '-'}{m.quantity}
                      </td>
                      <td className="px-4 py-3 text-xs text-[#666666] max-w-[200px] truncate">
                        {m.notes || '—'}
                      </td>
                      <td className="text-right px-6 py-3 text-[11px] text-[#999999] whitespace-nowrap">
                        {formatDate(m.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E5E5E5]">
          <button
            onClick={onClose}
            className="w-full border border-[#E5E5E5] py-3 text-[11px] font-bold uppercase tracking-[0.15em] hover:border-black transition-colors duration-150 cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
}
