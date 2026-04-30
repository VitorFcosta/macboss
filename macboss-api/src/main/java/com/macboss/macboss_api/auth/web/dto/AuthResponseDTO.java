package com.macboss.macboss_api.auth.web.dto;

public record AuthResponseDTO(
        UserResponseDTO user,
        String accessToken,
        String refreshToken
) {}
