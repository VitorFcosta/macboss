package com.macboss.macboss_api.auth.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequestDTO(
    @NotBlank(message = "O nome é obrigatório")
    String name,

    @NotBlank(message = "O email é obrigatório")
    @Email(message = "Formato de email inválido")
    String email,

    @NotBlank(message = "A senha é obrigatória")
    @Size(min = 8, message = "A senha deve ter no mínimo 8 caracteres")
    String password,

    @NotNull(message = "O consentimento é obrigatório")
    @AssertTrue(message = "Você deve aceitar os termos de privacidade")
    Boolean consentGiven
) {}
