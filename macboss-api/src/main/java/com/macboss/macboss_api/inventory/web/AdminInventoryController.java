package com.macboss.macboss_api.inventory.web;

import com.macboss.macboss_api.inventory.domain.BaseProduct;
import com.macboss.macboss_api.inventory.domain.BaseProductVariant;
import com.macboss.macboss_api.inventory.domain.StockMovement;
import com.macboss.macboss_api.inventory.service.InventoryService;
import com.macboss.macboss_api.inventory.web.dto.CreateBaseProductRequest;
import com.macboss.macboss_api.inventory.web.dto.CreateVariantRequest;
import com.macboss.macboss_api.inventory.web.dto.StockEntryRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/inventory")
public class AdminInventoryController {

    private final InventoryService inventoryService;

    public AdminInventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    // GET /api/v1/admin/inventory — lista todas as variantes
    @GetMapping
    public ResponseEntity<List<BaseProductVariant>> listVariants() {
        return ResponseEntity.ok(inventoryService.getAllVariants());
    }

    // GET /api/v1/admin/inventory/alerts — estoque baixo
    @GetMapping("/alerts")
    public ResponseEntity<List<BaseProductVariant>> getAlerts() {
        return ResponseEntity.ok(inventoryService.getAlerts());
    }

    // POST /api/v1/admin/inventory/entry — entrada de estoque
    @PostMapping("/entry")
    public ResponseEntity<StockMovement> addEntry(@Valid @RequestBody StockEntryRequest request) {
        return ResponseEntity.ok(inventoryService.addEntry(request));
    }

    // GET /api/v1/admin/inventory/{variantId}/movements — histórico
    @GetMapping("/{variantId}/movements")
    public ResponseEntity<List<StockMovement>> getMovements(@PathVariable UUID variantId) {
        return ResponseEntity.ok(inventoryService.getMovements(variantId));
    }

    // POST /api/v1/admin/inventory/products — criar produto base
    @PostMapping("/products")
    public ResponseEntity<BaseProduct> createProduct(@Valid @RequestBody CreateBaseProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(inventoryService.createBaseProduct(request));
    }

    // PUT /api/v1/admin/inventory/products/{productId} — editar produto base
    @PutMapping("/products/{productId}")
    public ResponseEntity<BaseProduct> updateProduct(
            @PathVariable UUID productId, 
            @Valid @RequestBody CreateBaseProductRequest request) {
        return ResponseEntity.ok(inventoryService.updateBaseProduct(productId, request));
    }

    // POST /api/v1/admin/inventory/variants — criar variante
    @PostMapping("/variants")
    public ResponseEntity<BaseProductVariant> createVariant(@Valid @RequestBody CreateVariantRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(inventoryService.createVariant(request));
    }

    // PUT /api/v1/admin/inventory/variants/{variantId} — editar variante
    @PutMapping("/variants/{variantId}")
    public ResponseEntity<BaseProductVariant> updateVariant(
            @PathVariable UUID variantId, 
            @Valid @RequestBody CreateVariantRequest request) {
        return ResponseEntity.ok(inventoryService.updateVariant(variantId, request));
    }

    // PATCH /api/v1/admin/inventory/variants/{variantId}/deactivate — soft delete
    @PatchMapping("/variants/{variantId}/deactivate")
    public ResponseEntity<Void> deactivateVariant(@PathVariable UUID variantId) {
        inventoryService.deactivateVariant(variantId);
        return ResponseEntity.noContent().build();
    }

}
