package com.macboss.macboss_api.inventory.service;

import com.macboss.macboss_api.inventory.domain.BaseProduct;
import com.macboss.macboss_api.inventory.domain.BaseProductVariant;
import com.macboss.macboss_api.inventory.domain.StockMovement;
import com.macboss.macboss_api.inventory.domain.StockMovementType;
import com.macboss.macboss_api.inventory.repository.BaseProductRepository;
import com.macboss.macboss_api.inventory.repository.BaseProductVariantRepository;
import com.macboss.macboss_api.inventory.repository.StockMovementRepository;
import com.macboss.macboss_api.inventory.web.dto.CreateBaseProductRequest;
import com.macboss.macboss_api.inventory.web.dto.CreateVariantRequest;
import com.macboss.macboss_api.inventory.web.dto.StockEntryRequest;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class InventoryService {

    private final BaseProductRepository productRepository;
    private final BaseProductVariantRepository variantRepository;
    private final StockMovementRepository movementRepository;

    public InventoryService(BaseProductRepository productRepository,
            BaseProductVariantRepository variantRepository,
            StockMovementRepository movementRepository) {
        this.productRepository = productRepository;
        this.variantRepository = variantRepository;
        this.movementRepository = movementRepository;
    }

    // --- CRUD ---

    public BaseProduct createBaseProduct(CreateBaseProductRequest request) {
        BaseProduct product = new BaseProduct();
        product.setName(request.name());
        product.setType(request.type());
        return productRepository.save(product);
    }

    public BaseProduct updateBaseProduct(UUID productId, CreateBaseProductRequest request) {
        BaseProduct product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Produto base não encontrado"));
        product.setName(request.name());
        product.setType(request.type());
        return productRepository.save(product);
    }

    public BaseProductVariant createVariant(CreateVariantRequest request) {
        BaseProduct product = productRepository.findById(request.productId())
                .orElseThrow(() -> new IllegalArgumentException("Produto base não encontrado"));

        String sku = generateSku(product, request.color().name(), request.size().name());

        if (variantRepository.findBySkuAndActiveTrue(sku).isPresent()) {
            throw new IllegalArgumentException("Já existe uma variante ativa cadastrada com o SKU: " + sku);
        }

        BaseProductVariant variant = new BaseProductVariant();
        variant.setProduct(product);
        variant.setSku(sku);
        variant.setColor(request.color());
        variant.setSize(request.size());
        variant.setPrice(request.price());

        if (request.minStockAlert() != null) {
            variant.setLowStockThreshold(request.minStockAlert());
        }

        return variantRepository.save(variant);
    }

    private String generateSku(BaseProduct product, String color, String size) {
        return String.format("MB-%s-%s-%s", product.getType().name(), color, size).toUpperCase();
    }

    // --- Movimentação de Estoque ---

    /** Entrada de estoque (compra/reposição do fornecedor) */
    public StockMovement addEntry(StockEntryRequest request) {
        BaseProductVariant variant = variantRepository.findById(request.variantId())
                .orElseThrow(() -> new IllegalArgumentException("Variante não encontrada"));

        variant.setQtyOnHand(variant.getQtyOnHand() + request.quantity());
        variantRepository.save(variant);

        return createMovement(variant, request.quantity(), StockMovementType.IN,
                request.notes() != null ? request.notes() : "Entrada manual de estoque", null);
    }

    /** Reserva estoque ao criar um pedido (pedido pendente) */
    public StockMovement reserveStock(UUID variantId, int quantity, UUID orderId) {
        BaseProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new IllegalArgumentException("Variante não encontrada"));

        if (variant.getAvailableQty() < quantity) {
            throw new IllegalStateException(
                    "Estoque insuficiente. Disponível: " + variant.getAvailableQty() + ", Solicitado: " + quantity);
        }

        variant.setQtyReserved(variant.getQtyReserved() + quantity);
        variantRepository.save(variant);

        return createMovement(variant, quantity, StockMovementType.RESERVE,
                "Reserva para pedido", orderId);
    }

    /** Libera estoque reservado (pedido cancelado) */
    public StockMovement releaseStock(UUID variantId, int quantity, UUID orderId) {
        BaseProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new IllegalArgumentException("Variante não encontrada"));

        variant.setQtyReserved(Math.max(0, variant.getQtyReserved() - quantity));
        variantRepository.save(variant);

        return createMovement(variant, quantity, StockMovementType.RELEASE,
                "Liberação — pedido cancelado", orderId);
    }

    /** Consome estoque reservado (pedido pago, sai do físico) */
    public StockMovement consumeStock(UUID variantId, int quantity, UUID orderId) {
        BaseProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new IllegalArgumentException("Variante não encontrada"));

        variant.setQtyOnHand(variant.getQtyOnHand() - quantity);
        variant.setQtyReserved(Math.max(0, variant.getQtyReserved() - quantity));
        variantRepository.save(variant);

        return createMovement(variant, quantity, StockMovementType.CONSUME,
                "Consumo — pedido confirmado", orderId);
    }

    // --- Consultas ---

    /** Lista TODAS as variantes (ativas + inativas) para a tabela admin */
    public List<BaseProductVariant> getAllVariants() {
        return variantRepository.findAll();
    }

    /** Calcula quantidade disponível = onHand - reserved */
    public int getAvailableQty(UUID variantId) {
        BaseProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new IllegalArgumentException("Variante não encontrada"));
        return variant.getAvailableQty();
    }

    /** Alertas de estoque baixo (disponível <= threshold) */
    public List<BaseProductVariant> getAlerts() {
        return variantRepository.findLowStockVariants();
    }

    /** Histórico de movimentações de uma variante */
    public List<StockMovement> getMovements(UUID variantId) {
        return movementRepository.findByVariantIdOrderByCreatedAtDesc(variantId);
    }

    // --- Desativação ---

    public void deactivateVariant(UUID variantId) {
        BaseProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new IllegalArgumentException("Variante não encontrada"));
        variant.setActive(false);
        variantRepository.save(variant);
    }

    // --- Edição ---

    public BaseProductVariant updateVariant(UUID variantId, CreateVariantRequest request) {
        BaseProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new IllegalArgumentException("Variante não encontrada"));

        // Recalcula o SKU se a cor ou tamanho mudaram (no backend a regra permanece para segurança)
        String newSku = generateSku(variant.getProduct(), request.color().name(), request.size().name());
        
        // Se o SKU mudou e já existe uma variante ATIVA com esse novo SKU, barra.
        if (!newSku.equals(variant.getSku()) && variantRepository.findBySkuAndActiveTrue(newSku).isPresent()) {
            throw new IllegalArgumentException("Já existe uma variante ativa cadastrada com o SKU: " + newSku);
        }

        variant.setSku(newSku);
        variant.setColor(request.color());
        variant.setSize(request.size());
        variant.setPrice(request.price());
        
        if (request.minStockAlert() != null) {
            variant.setLowStockThreshold(request.minStockAlert());
        }

        return variantRepository.save(variant);
    }

    // --- Helper ---

    private StockMovement createMovement(BaseProductVariant variant, int qty,
            StockMovementType type, String notes, UUID referenceId) {
        StockMovement movement = new StockMovement();
        movement.setVariant(variant);
        movement.setQuantity(qty);
        movement.setType(type);
        movement.setNotes(notes);
        movement.setReferenceId(referenceId);
        return movementRepository.save(movement);
    }

}
