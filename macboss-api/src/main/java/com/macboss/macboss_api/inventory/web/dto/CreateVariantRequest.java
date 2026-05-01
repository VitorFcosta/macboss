package com.macboss.macboss_api.inventory.web.dto;

import com.macboss.macboss_api.inventory.domain.ShirtColor;
import com.macboss.macboss_api.inventory.domain.ShirtSize;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

public record CreateVariantRequest(
        @NotNull(message = "O ID do produto base é obrigatório")
        UUID productId,
        
        @NotNull(message = "A cor é obrigatória")
        ShirtColor color,
        
        @NotNull(message = "O tamanho é obrigatório")
        ShirtSize size,
        
        @NotNull(message = "O preço é obrigatório")
        @DecimalMin(value = "0.01", message = "O preço deve ser maior que zero")
        BigDecimal price,
        
        @Min(value = 1, message = "O alerta mínimo deve ser pelo menos 1")
        Integer minStockAlert
) {}
