import { useState, useEffect, useCallback, useMemo } from 'react';
import { AlertTriangle, Plus, Clock, Trash2, Pencil } from 'lucide-react';
import { inventoryService } from '../../lib/inventory';

import CreateProductModal from '../../components/admin/CreateProductModal';
import AddStockModal from '../../components/admin/AddStockModal';
import MovementHistoryModal from '../../components/admin/MovementHistoryModal';
import EditVariantModal from '../../components/admin/EditVariantModal';
import AdminHeader from '../../components/admin/AdminHeader';
import StatBox from '../../components/admin/StatBox';

/**
 * Retorna a cor do indicador de estoque:
 * Verde = disponível > threshold * 2 (saudável)
 * Amarelo = disponível > threshold mas <= threshold * 2 (atenção)
 * Vermelho = disponível <= threshold (crítico)
 */
function stockIndicator(available, threshold) {
  if (available <= threshold) return { color: '#CC0000', label: 'CRÍTICO' };
  if (available <= threshold * 2) return { color: '#E67E22', label: 'ATENÇÃO' };
  return { color: '#2D8C3C', label: 'OK' };
}

const colorLabels = {
  BLACK: 'Preto',
  WHITE: 'Branco',
  NAVY: 'Azul Marinho',
  LIGHT_BLUE: 'Azul Claro',
  GREY: 'Cinza',
  BEIGE: 'Bege',
  OLIVE: 'Verde Oliva',
  BURGUNDY: 'Bordô'
};

function getColorLabel(color) {
  return colorLabels[color] || color;
}

export default function Inventory() {
  const [variants, setVariants] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedVariantForStock, setSelectedVariantForStock] = useState(null);
  const [selectedVariantForHistory, setSelectedVariantForHistory] = useState(null);
  const [selectedVariantForEdit, setSelectedVariantForEdit] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [allVariants, lowStock] = await Promise.all([
        inventoryService.getAllVariants(),
        inventoryService.getAlerts()
      ]);
      setVariants(allVariants);
      setAlerts(lowStock);
    } catch (error) {
      console.error('Erro ao buscar dados do inventário:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function loadInitialData() {
      try {
        const [allVariants, lowStock] = await Promise.all([
          inventoryService.getAllVariants(),
          inventoryService.getAlerts()
        ]);

        if (active) {
          setVariants(allVariants);
          setAlerts(lowStock);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do inventário:', error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadInitialData();

    return () => {
      active = false;
    };
  }, []);

  const handleDeactivate = async (variant) => {
    if (!confirm(`Desativar "${variant.product?.name} — ${variant.size} ${variant.color}"?`)) return;
    try {
      await inventoryService.deactivateVariant(variant.id);
      fetchData();
    } catch (err) {
      console.error('Erro ao desativar:', err);
      alert('Não foi possível desativar a variante.');
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

  const colorOptions = useMemo(() => (
    [...new Set(variants.map((variant) => variant.color).filter(Boolean))]
      .sort((a, b) => getColorLabel(a).localeCompare(getColorLabel(b), 'pt-BR'))
  ), [variants]);

  const sizeOptions = useMemo(() => (
    [...new Set(variants.map((variant) => variant.size).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, 'pt-BR'))
  ), [variants]);

  const filteredVariants = useMemo(() => (
    variants.filter((variant) => {
      const isActive = variant.active !== false;
      const matchesColor = !selectedColor || variant.color === selectedColor;
      const matchesSize = !selectedSize || variant.size === selectedSize;
      const matchesStatus =
        !selectedStatus ||
        (selectedStatus === 'active' && isActive) ||
        (selectedStatus === 'inactive' && !isActive);

      return matchesColor && matchesSize && matchesStatus;
    })
  ), [variants, selectedColor, selectedSize, selectedStatus]);

  const hasActiveFilters = selectedColor || selectedSize || selectedStatus;

  return (
    <div className="min-h-screen bg-white font-['DM_Sans'] text-black p-6 md:p-12">

      <AdminHeader title="MAC BOSS — INVENTÁRIO" subtitle="LISAS" />

      {/* MÉTRICAS & AÇÃO */}
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <StatBox
          title="ALERTA DE ESTOQUE"
          value={alerts.length}
          subtitle="Variantes críticas"
          icon={AlertTriangle}
          bgColor="#FFF9C4"
          textColor="#B89000"
        />
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center justify-center gap-2 bg-black text-white px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#333333] transition-colors duration-200 cursor-pointer w-full md:w-auto"
        >
          <Plus className="w-4 h-4" />
          Nova Camisa Lisa
        </button>
      </div>

      {/* FILTROS */}
      <div className="mb-4 border border-[#E5E5E5] bg-[#FAFAFA] px-4 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="inventory-color-filter" className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#999999] mb-1.5">
                Cor
              </label>
              <select
                id="inventory-color-filter"
                value={selectedColor}
                onChange={(event) => setSelectedColor(event.target.value)}
                className="w-full min-w-44 border border-[#E5E5E5] bg-white px-3 py-2.5 text-sm font-bold text-black outline-none transition-colors focus:border-black"
              >
                <option value="">Todas as cores</option>
                {colorOptions.map((color) => (
                  <option key={color} value={color}>
                    {getColorLabel(color)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="inventory-size-filter" className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#999999] mb-1.5">
                Tamanho
              </label>
              <select
                id="inventory-size-filter"
                value={selectedSize}
                onChange={(event) => setSelectedSize(event.target.value)}
                className="w-full min-w-36 border border-[#E5E5E5] bg-white px-3 py-2.5 text-sm font-bold text-black outline-none transition-colors focus:border-black"
              >
                <option value="">Todos os tamanhos</option>
                {sizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="inventory-status-filter" className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#999999] mb-1.5">
                Status
              </label>
              <select
                id="inventory-status-filter"
                value={selectedStatus}
                onChange={(event) => setSelectedStatus(event.target.value)}
                className="w-full min-w-36 border border-[#E5E5E5] bg-white px-3 py-2.5 text-sm font-bold text-black outline-none transition-colors focus:border-black"
              >
                <option value="">Todos</option>
                <option value="active">Ativas</option>
                <option value="inactive">Inativas</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#666666]">
              {filteredVariants.length} de {variants.length} variantes
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedColor('');
                setSelectedSize('');
                setSelectedStatus('');
              }}
              disabled={!hasActiveFilters}
              className="border border-[#E5E5E5] bg-white px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-black transition-colors hover:border-black disabled:cursor-not-allowed disabled:opacity-40"
            >
              Limpar filtros
            </button>
          </div>
        </div>
      </div>

      {/* TABELA */}
      <div className="border border-[#E5E5E5] overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-[#E5E5E5] bg-[#FAFAFA]">
              <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#999999]">Status</th>
              <th className="text-left px-4 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#999999]">Produto</th>
              <th className="text-left px-4 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#999999]">SKU</th>
              <th className="text-left px-4 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#999999]">Cor</th>
              <th className="text-left px-4 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#999999]">Tamanho</th>
              <th className="text-right px-4 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#999999]">Estoque</th>
              <th className="text-right px-4 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#999999]">Reservado</th>
              <th className="text-right px-4 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#999999]">Disponível</th>
              <th className="text-right px-4 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#999999]">Preço</th>
              <th className="text-right px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#999999]">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="px-6 py-10 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-[#999999]">
                  CARREGANDO...
                </td>
              </tr>
            ) : variants.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-6 py-10 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-[#999999]">
                  Nenhuma variante cadastrada.
                </td>
              </tr>
            ) : filteredVariants.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-6 py-10 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-[#999999]">
                  Nenhuma variante encontrada com os filtros selecionados.
                </td>
              </tr>
            ) : (
              filteredVariants.map((v) => {
                const isActive = v.active !== false;
                const onHand = v.qtyOnHand ?? 0;
                const reserved = v.qtyReserved ?? 0;
                const available = v.availableQty ?? (onHand - reserved);
                const threshold = v.lowStockThreshold ?? 5;
                const indicator = stockIndicator(available, threshold);

                return (
                  <tr
                    key={v.id}
                    className={`border-b border-[#F0F0F0] transition-colors ${isActive ? 'hover:bg-[#FAFAFA]' : 'opacity-40'}`}
                  >
                    {/* Status — indicador visual */}
                    <td className="px-6 py-4">
                      {isActive ? (
                        <span className="flex items-center gap-2">
                          <span
                            className="inline-block w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: indicator.color }}
                            title={indicator.label}
                          />
                          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: indicator.color }}>
                            {indicator.label}
                          </span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#999999]">
                          INATIVO
                        </span>
                      )}
                    </td>

                    {/* Produto */}
                    <td className="px-4 py-4 text-sm font-bold uppercase tracking-wider text-black">
                      {v.product?.name || '—'}
                    </td>

                    {/* SKU */}
                    <td className="px-4 py-4 text-xs text-[#999999] tracking-wider font-mono">
                      {v.sku}
                    </td>

                    {/* Cor */}
                    <td className="px-4 py-4 text-xs font-bold uppercase text-black">
                      {getColorLabel(v.color)}
                    </td>

                    {/* Tamanho */}
                    <td className="px-4 py-4 text-xs font-bold uppercase text-black">
                      {v.size}
                    </td>

                    {/* Estoque (onHand) */}
                    <td className="text-right px-4 py-4 font-['Bebas_Neue'] text-2xl leading-none text-black">
                      {onHand}
                    </td>

                    {/* Reservado */}
                    <td className="text-right px-4 py-4 font-['Bebas_Neue'] text-2xl leading-none text-[#E67E22]">
                      {reserved}
                    </td>

                    {/* Disponível */}
                    <td className="text-right px-4 py-4 font-['Bebas_Neue'] text-2xl leading-none" style={{ color: indicator.color }}>
                      {available}
                    </td>

                    {/* Preço */}
                    <td className="text-right px-4 py-4 text-sm font-bold text-black">
                      {formatPrice(v.price)}
                    </td>

                    {/* Ações */}
                    <td className="text-right px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => isActive && setSelectedVariantForStock(v)}
                          disabled={!isActive}
                          title="Repor estoque"
                          className="p-2 hover:bg-black hover:text-white text-black transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <Plus size={16} />
                        </button>
                        <button
                          onClick={() => setSelectedVariantForHistory(v)}
                          title="Histórico"
                          className="p-2 hover:bg-black hover:text-white text-black transition-colors duration-150 cursor-pointer"
                        >
                          <Clock size={16} />
                        </button>
                        <button
                          onClick={() => isActive && setSelectedVariantForEdit(v)}
                          disabled={!isActive}
                          title={isActive ? 'Editar' : 'Já desativada'}
                          className="p-2 hover:bg-black hover:text-white text-black transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => isActive && handleDeactivate(v)}
                          disabled={!isActive}
                          title={isActive ? 'Desativar' : 'Já desativada'}
                          className="p-2 hover:bg-[#CC0000] hover:text-white text-black transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL: Criar novo produto */}
      <CreateProductModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={fetchData}
      />

      {/* MODAL: Repor estoque */}
      {selectedVariantForStock && (
        <AddStockModal
          variant={selectedVariantForStock}
          onClose={() => setSelectedVariantForStock(null)}
          onSuccess={() => { setSelectedVariantForStock(null); fetchData(); }}
        />
      )}

      {/* MODAL: Histórico de movimentações */}
      {selectedVariantForHistory && (
        <MovementHistoryModal
          variant={selectedVariantForHistory}
          onClose={() => setSelectedVariantForHistory(null)}
        />
      )}

      {/* MODAL: Edição Segura */}
      {selectedVariantForEdit && (
        <EditVariantModal
          variant={selectedVariantForEdit}
          isOpen={!!selectedVariantForEdit}
          onClose={() => setSelectedVariantForEdit(null)}
          onSuccess={() => { setSelectedVariantForEdit(null); fetchData(); }}
        />
      )}

    </div>
  );
}
