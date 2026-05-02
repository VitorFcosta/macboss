package com.macboss.macboss_api.inventory.web.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record StockEntryRequest(
        @NotNull(message = "O ID da variante é obrigatório")
        UUID variantId,

        @NotNull(message = "A quantidade é obrigatória")
        @Min(value = 1, message = "A quantidade deve ser pelo menos 1")
        Integer quantity,
        
        String notes
) {}
