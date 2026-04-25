package com.macboss.macboss_api.auth.dto;

import java.util.UUID;

public record UserResponseDTO(
    UUID id,
    String name,
    String email,
    String role
){}
    

