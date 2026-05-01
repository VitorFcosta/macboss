package com.macboss.macboss_api.inventory.web.dto;

import com.macboss.macboss_api.inventory.domain.ProductType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateBaseProductRequest(
        
        @NotBlank(message = "O nome do produto é obrigatório")
        @Size(max = 100, message = "O nome não pode exceder 100 caracteres")
        String name,
        
        @NotNull(message = "O tipo de produto é obrigatório")
        ProductType type
) {}
