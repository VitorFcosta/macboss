package com.macboss.macboss_api.inventory.web;

import com.macboss.macboss_api.inventory.domain.BaseProduct;
import com.macboss.macboss_api.inventory.domain.BaseProductVariant;
import com.macboss.macboss_api.inventory.domain.StockMovement;
import com.macboss.macboss_api.inventory.service.InventoryService;
import com.macboss.macboss_api.inventory.web.dto.AddStockRequest;
import com.macboss.macboss_api.inventory.web.dto.CreateBaseProductRequest;
import com.macboss.macboss_api.inventory.web.dto.CreateVariantRequest;
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

    @PostMapping("/products")
    public ResponseEntity<BaseProduct> createProduct(@Valid @RequestBody CreateBaseProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(inventoryService.createBaseProduct(request));
    }

    @PostMapping("/variants")
    public ResponseEntity<BaseProductVariant> createVariant(@Valid @RequestBody CreateVariantRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(inventoryService.createVariant(request));
    }

    @PostMapping("/variants/{variantId}/stock")
    public ResponseEntity<StockMovement> addStock(
            @PathVariable UUID variantId, 
            @Valid @RequestBody AddStockRequest request) {
        return ResponseEntity.ok(inventoryService.addStock(variantId, request));
    }

    @GetMapping("/alerts/low-stock")
    public ResponseEntity<List<BaseProductVariant>> getLowStockAlerts() {
        return ResponseEntity.ok(inventoryService.getLowStockAlerts());
    }

    @GetMapping("/variants/{variantId}/movements")
    public ResponseEntity<List<StockMovement>> getVariantMovements(@PathVariable UUID variantId) {
        return ResponseEntity.ok(inventoryService.getVariantMovements(variantId));
    }
}
