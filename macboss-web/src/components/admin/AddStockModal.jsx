import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { inventoryService } from '../../lib/inventory';

export default function AddStockModal({ variant, onClose, onSuccess }) {
  const [qty, setQty] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await inventoryService.addEntry({
        variantId: variant.id,
        quantity: parseInt(qty),
        notes: notes || 'Reposição manual'
      });
      onSuccess();
    } catch (err) {
      setError('Erro ao repor estoque. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-[#E5E5E5] focus:border-black outline-none px-3 py-2.5 text-sm font-['DM_Sans'] text-black placeholder:text-[#CCCCCC] transition-colors duration-150";
  const labelClass = "block text-[10px] font-bold uppercase tracking-[0.15em] text-[#999999] mb-1.5";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-stock-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white border border-black w-full max-w-sm">

        <div className="flex justify-between items-center px-6 py-4 border-b border-[#E5E5E5]">
          <div>
            <h2 id="add-stock-title" className="font-['DM_Sans'] font-bold text-sm uppercase tracking-[0.15em]">
              Repor Estoque
            </h2>
            <p className="text-[10px] text-[#999999] tracking-wider mt-0.5">
              {variant.product?.name} — {variant.size} / {variant.color}
            </p>
          </div>
          <button onClick={onClose} aria-label="Fechar" className="text-[#999999] hover:text-black transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">

          <div>
            <label htmlFor="stock-qty" className={labelClass}>Quantidade a adicionar</label>
            <input
              id="stock-qty"
              ref={inputRef}
              type="number"
              min="1"
              step="1"
              required
              placeholder="Ex: 50"
              value={qty}
              onChange={(e) => { setQty(e.target.value); setError(''); }}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="stock-notes" className={labelClass}>Observação (opcional)</label>
            <input
              id="stock-notes"
              type="text"
              placeholder="Ex: Compra fornecedor #42"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={inputClass}
            />
          </div>

          {error && (
            <p role="alert" className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#CC0000]">{error}</p>
          )}

          <div className="flex gap-3 mt-1">
            <button type="button" onClick={onClose} className="flex-1 border border-[#E5E5E5] py-3 text-[11px] font-bold uppercase tracking-[0.15em] hover:border-black transition-colors duration-150">
              Cancelar
            </button>
            <button type="submit" disabled={loading} aria-busy={loading} className="flex-1 bg-black text-white py-3 text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-[#333333] transition-colors duration-150 disabled:bg-[#999999] disabled:cursor-not-allowed">
              {loading ? 'SALVANDO...' : 'CONFIRMAR'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
