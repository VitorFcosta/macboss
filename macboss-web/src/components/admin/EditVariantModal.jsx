import { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { inventoryService } from '../../lib/inventory';

function getInitialFormData(variant) {
  return {
    productName: variant?.product?.name || '',
    price: variant?.price || '',
    minStockAlert: variant?.lowStockThreshold || ''
  };
}

export default function EditVariantModal({ variant, isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState(() => getInitialFormData(variant));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !variant) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Se o nome do produto mudou, atualiza o BaseProduct
      if (formData.productName !== variant.product.name) {
        await inventoryService.updateBaseProduct(variant.product.id, {
          name: formData.productName.toUpperCase(),
          type: variant.product.type
        });
      }

      // Atualiza a variante (preço e alerta mínimo)
      // Passamos a cor e tamanho originais, pois não mudam (read-only)
      await inventoryService.updateVariant(variant.id, {
        productId: variant.product.id,
        color: variant.color,
        size: variant.size,
        price: parseFloat(formData.price),
        minStockAlert: parseInt(formData.minStockAlert, 10)
      });

      onSuccess();
    } catch (err) {
      console.error('Erro ao editar:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Erro ao salvar as alterações. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#999999] hover:text-black transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <h2 className="text-xl font-bold uppercase tracking-[0.15em] mb-1">
            EDITAR VARIANTE
          </h2>
          <p className="text-xs text-[#999999] tracking-wider mb-6">
            SKU: {variant.sku}
          </p>

          {error && (
            <div className="mb-6 bg-[#FFF9C4] p-4 flex gap-3 items-start border-l-2 border-[#B89000]">
              <AlertCircle className="w-4 h-4 text-[#B89000] shrink-0 mt-0.5" />
              <p className="text-xs font-bold uppercase tracking-wider text-[#B89000] leading-relaxed">
                {error}
              </p>
            </div>
          )}

          {/* AVISO DIDÁTICO */}
          <div className="mb-6 bg-[#FAFAFA] border border-[#E5E5E5] p-4">
            <p className="text-[10px] text-[#666666] tracking-wider uppercase font-bold leading-relaxed">
              ATENÇÃO: Cor ({variant.color}) e Tamanho ({variant.size}) não podem ser alterados para preservar a integridade do histórico. Se houver erro, desative esta variante e crie uma nova.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#999999] mb-2">
                NOME DO PRODUTO (AFETA TODAS AS VARIANTES)
              </label>
              <input
                type="text"
                required
                className="w-full border-b-2 border-[#E5E5E5] focus:border-black py-2 text-sm font-bold uppercase outline-none transition-colors"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#999999] mb-2">
                  PREÇO (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="w-full border-b-2 border-[#E5E5E5] focus:border-black py-2 text-sm font-bold outline-none transition-colors"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#999999] mb-2">
                  ALERTA (MÍNIMO)
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  className="w-full border-b-2 border-[#E5E5E5] focus:border-black py-2 text-sm font-bold outline-none transition-colors"
                  value={formData.minStockAlert}
                  onChange={(e) => setFormData({ ...formData, minStockAlert: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-black text-white py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#333333] transition-colors disabled:opacity-50"
            >
              {loading ? (
                'SALVANDO...'
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  SALVAR ALTERAÇÕES
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
