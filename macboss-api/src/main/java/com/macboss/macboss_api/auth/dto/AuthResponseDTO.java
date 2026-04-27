package com.macboss.macboss_api.auth.dto;

public record AuthResponseDTO(
        UserResponseDTO user,
        String accessToken,
        String refreshToken
) {}
