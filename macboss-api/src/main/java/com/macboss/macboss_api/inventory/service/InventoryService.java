package com.macboss.macboss_api.inventory.service;

import com.macboss.macboss_api.inventory.domain.BaseProduct;
import com.macboss.macboss_api.inventory.domain.BaseProductVariant;
import com.macboss.macboss_api.inventory.domain.StockMovement;
import com.macboss.macboss_api.inventory.repository.BaseProductRepository;
import com.macboss.macboss_api.inventory.repository.BaseProductVariantRepository;
import com.macboss.macboss_api.inventory.repository.StockMovementRepository;
import com.macboss.macboss_api.inventory.web.dto.AddStockRequest;
import com.macboss.macboss_api.inventory.web.dto.CreateBaseProductRequest;
import com.macboss.macboss_api.inventory.web.dto.CreateVariantRequest;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class InventoryService {

    private final BaseProductRepository productRepository;
    private final BaseProductVariantRepository variantRepository;
    private final StockMovementRepository movementRepository;

    // Construtor para Injeção de Dependência (substitui o @Autowired)
    public InventoryService(BaseProductRepository productRepository, 
                            BaseProductVariantRepository variantRepository, 
                            StockMovementRepository movementRepository) {
        this.productRepository = productRepository;
        this.variantRepository = variantRepository;
        this.movementRepository = movementRepository;
    }

    // 1. Criar Produto Base
    public BaseProduct createBaseProduct(CreateBaseProductRequest request) {
        BaseProduct product = new BaseProduct();
        product.setName(request.name());
        product.setType(request.type());
        
        return productRepository.save(product);
    }
    
    // 2. Criar Variante (Item real de venda)
    public BaseProductVariant createVariant(CreateVariantRequest request) {
        // Busca o produto pai, se não achar explode um erro
        BaseProduct product = productRepository.findById(request.productId())
                .orElseThrow(() -> new IllegalArgumentException("Produto base não encontrado"));

        // Gera o SKU padronizado
        String sku = generateSku(product, request.color().name(), request.size().name());

        // Verifica se essa combinação (SKU) já foi cadastrada antes
        if (variantRepository.findBySku(sku).isPresent()) {
            throw new IllegalArgumentException("Já existe uma variante cadastrada com o SKU: " + sku);
        }

        // Monta a nova variante
        BaseProductVariant variant = new BaseProductVariant();
        variant.setProduct(product);
        variant.setSku(sku);
        variant.setColor(request.color());
        variant.setSize(request.size());
        variant.setPrice(request.price());
        
        if (request.minStockAlert() != null) {
            variant.setMinStockAlert(request.minStockAlert());
        }
        // O availableQty já nasce como 0 por causa do valor default na Entidade.

        return variantRepository.save(variant);
    }

    // Helper: Gerador de SKU. Ex: MB-T_SHIRT-BLACK-M
    private String generateSku(BaseProduct product, String color, String size) {
        return String.format("MB-%s-%s-%s", product.getType().name(), color, size).toUpperCase();
    }

    // 3. Adicionar Estoque (Entrada)
    public StockMovement addStock(UUID variantId, AddStockRequest request) {
        // 1. Busca a variante
        BaseProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new IllegalArgumentException("Variante não encontrada"));

        // 2. Atualiza a quantidade total disponível
        variant.setAvailableQty(variant.getAvailableQty() + request.quantity());
        variantRepository.save(variant); // Salva o novo saldo

        // 3. Cria o log (Histórico da movimentação)
        StockMovement movement = new StockMovement();
        movement.setVariant(variant);
        movement.setQuantity(request.quantity());
        movement.setType(com.macboss.macboss_api.inventory.domain.StockMovementType.IN);
        movement.setReason(request.reason() != null ? request.reason() : "Entrada manual de estoque");

        return movementRepository.save(movement);
    }

    // 4. Buscar produtos com estoque baixo (Para o painel do Admin)
    public java.util.List<BaseProductVariant> getLowStockAlerts() {
        return variantRepository.findLowStockVariants();
    }

    // 5. Histórico de movimentações de um item específico
    public java.util.List<StockMovement> getVariantMovements(UUID variantId) {
        return movementRepository.findByVariantIdOrderByCreatedAtDesc(variantId);
    }

}
