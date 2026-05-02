import { api } from './api';

// Todas as chamadas para o AdminInventoryController
// Rotas conforme Plano de Implementação — Notion 2.3
export const inventoryService = {
  
  // GET /api/v1/admin/inventory — lista todas as variantes
  getAllVariants: async () => {
    const response = await api.get('/admin/inventory');
    return response.data;
  },

  // GET /api/v1/admin/inventory/alerts — estoque baixo
  getAlerts: async () => {
    const response = await api.get('/admin/inventory/alerts');
    return response.data;
  },

  // POST /api/v1/admin/inventory/entry — entrada de estoque (variantId no body)
  addEntry: async (data) => {
    const response = await api.post('/admin/inventory/entry', data);
    return response.data;
  },

  // GET /api/v1/admin/inventory/{variantId}/movements — histórico
  getMovements: async (variantId) => {
    const response = await api.get(`/admin/inventory/${variantId}/movements`);
    return response.data;
  },

  // POST /api/v1/admin/inventory/products — criar produto base
  createBaseProduct: async (data) => {
    const response = await api.post('/admin/inventory/products', data);
    return response.data;
  },

  // POST /api/v1/admin/inventory/variants — criar variante
  createVariant: async (data) => {
    const response = await api.post('/admin/inventory/variants', data);
    return response.data;
  },

  // PATCH /api/v1/admin/inventory/variants/{variantId}/deactivate — soft delete
  deactivateVariant: async (variantId) => {
    await api.patch(`/admin/inventory/variants/${variantId}/deactivate`);
  },

  // PUT /api/v1/admin/inventory/variants/{variantId} — atualizar variante
  updateVariant: async (variantId, data) => {
    const response = await api.put(`/admin/inventory/variants/${variantId}`, data);
    return response.data;
  },

  // PUT /api/v1/admin/inventory/products/{productId} — atualizar produto base
  updateBaseProduct: async (productId, data) => {
    const response = await api.put(`/admin/inventory/products/${productId}`, data);
    return response.data;
  }

};
