import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { inventoryService } from '../../lib/inventory';

export default function CreateProductModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    color: 'BLACK',
    size: 'M',
    price: '',
    initialQty: '0',    // ← NOVO: quantidade inicial
    minStockAlert: '5'
  });

  const firstInputRef = useRef(null);

  // Acessibilidade: foca o primeiro campo quando o modal abre
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Acessibilidade: fecha modal com Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    setError('');
  };

  const reset = () => setFormData({
    name: '', color: 'BLACK', size: 'M', price: '', initialQty: '0', minStockAlert: '5'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Cria o Produto Base (T_SHIRT — Fase 2 do plano)
      const baseProduct = await inventoryService.createBaseProduct({
        name: formData.name,
        type: 'T_SHIRT'
      });

      // 2. Cria a Variante associada
      const variant = await inventoryService.createVariant({
        productId: baseProduct.id,
        color: formData.color,
        size: formData.size,
        price: parseFloat(formData.price),
        minStockAlert: parseInt(formData.minStockAlert)
      });

      // 3. Se o usuário informou quantidade inicial > 0, já registra a entrada de estoque
      const qty = parseInt(formData.initialQty);
      if (qty > 0) {
        await inventoryService.addEntry({
          variantId: variant.id,
          quantity: qty,
          notes: 'Entrada inicial de estoque'
        });
      }

      onSuccess();
      onClose();
      reset();
    } catch (err) {
      const apiErrorMessage = err.response?.data?.error || err.response?.data?.message;
      if (apiErrorMessage) {
        setError(apiErrorMessage);
      } else {
        setError('Erro ao cadastrar. Verifique os dados e tente novamente.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-[#E5E5E5] focus:border-black outline-none px-3 py-2.5 text-sm font-['DM_Sans'] text-black placeholder:text-[#CCCCCC] transition-colors duration-150";
  const selectClass = "w-full border border-[#E5E5E5] focus:border-black outline-none px-3 py-2.5 text-sm font-['DM_Sans'] font-medium text-black bg-white transition-colors duration-150 cursor-pointer";
  const labelClass = "block text-[10px] font-bold uppercase tracking-[0.15em] text-[#999999] mb-1.5";

  return (
    // Acessibilidade: role="dialog", aria-modal, aria-labelledby
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()} // fecha ao clicar fora
    >
      <div className="bg-white border border-black w-full max-w-md">

        {/* CABEÇALHO */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#E5E5E5]">
          <div>
            <h2
              id="modal-title"
              className="font-['DM_Sans'] font-bold text-sm uppercase tracking-[0.15em]"
            >
              Nova Camisa Lisa
            </h2>
            <p className="text-[10px] text-[#999999] tracking-wider mt-0.5">
              Insumo / T_SHIRT — Módulo Inventário
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar modal"
            className="text-[#999999] hover:text-black transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* FORMULÁRIO */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">

          {/* Nome */}
          <div>
            <label htmlFor="product-name" className={labelClass}>Nome do produto</label>
            <input
              id="product-name"
              ref={firstInputRef}
              type="text"
              required
              placeholder="Ex: Camiseta Heavy 380g"
              value={formData.name}
              onChange={handleChange('name')}
              className={inputClass}
            />
          </div>

          {/* Cor + Tamanho */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="product-color" className={labelClass}>Cor</label>
              <select id="product-color" value={formData.color} onChange={handleChange('color')} className={selectClass}>
                <option value="BLACK">Preto</option>
                <option value="WHITE">Branco</option>
                <option value="NAVY">Azul Marinho</option>
                <option value="BEIGE">Bege</option>
                <option value="OLIVE">Verde Oliva</option>
              </select>
            </div>
            <div>
              <label htmlFor="product-size" className={labelClass}>Tamanho</label>
              <select id="product-size" value={formData.size} onChange={handleChange('size')} className={selectClass}>
                <option value="P">P</option>
                <option value="M">M</option>
                <option value="G">G</option>
                <option value="GG">GG</option>
                <option value="XGG">XGG</option>
              </select>
            </div>
          </div>

          {/* Preço + Alerta mínimo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="product-price" className={labelClass}>Preço base (R$)</label>
              <input
                id="product-price"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0,00"
                value={formData.price}
                onChange={handleChange('price')}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="product-min-alert" className={labelClass}>Alerta mín. estoque</label>
              <input
                id="product-min-alert"
                type="number"
                min="1"
                required
                placeholder="5"
                value={formData.minStockAlert}
                onChange={handleChange('minStockAlert')}
                className={inputClass}
              />
            </div>
          </div>

          {/* Quantidade inicial — divisor visual */}
          <div className="border-t border-[#E5E5E5] pt-4">
            <label htmlFor="product-initial-qty" className={labelClass}>
              Qtd. inicial em estoque
            </label>
            <p className="text-[10px] text-[#999999] mb-1.5">
              Se informado, registra uma entrada de estoque automaticamente.
            </p>
            <input
              id="product-initial-qty"
              type="number"
              min="0"
              step="1"
              placeholder="0"
              value={formData.initialQty}
              onChange={handleChange('initialQty')}
              className={inputClass}
            />
          </div>

          {/* Erro */}
          {error && (
            <p role="alert" className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#CC0000]">
              {error}
            </p>
          )}

          {/* AÇÕES */}
          <div className="flex gap-3 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-[#E5E5E5] py-3 text-[11px] font-bold uppercase tracking-[0.15em] hover:border-black transition-colors duration-150"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="flex-1 bg-black text-white py-3 text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-[#333333] transition-colors duration-150 disabled:bg-[#999999] disabled:cursor-not-allowed"
            >
              {loading ? 'SALVANDO...' : 'CRIAR CAMISA'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
