package com.macboss.macboss_api.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpCookie;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class CookieService {

    private final long expirationTimeMs;

    public CookieService(@Value("${jwt.expiration}") long expirationTimeMs) {
        this.expirationTimeMs = expirationTimeMs;
    }

    // Pega a pulseira JWT e tranca dentro do Cofre (HttpOnly Cookie)
    public HttpCookie createAuthCookie(String jwt) {
        return ResponseCookie.from("macboss_token", jwt)
                .httpOnly(true) // JavaScript NÃO pode ler (Proteção máxima contra XSS)
                .secure(false)  // "false" porque estamos rodando no localhost (Sem HTTPS). Em Produção virará TRUE.
                .path("/")      // Válido para qualquer página do site
                .maxAge(Duration.ofMillis(expirationTimeMs)) // Expira junto com o JWT
                .sameSite("Strict") // Impede que outro site tente usar esse cookie (Proteção CSRF)
                .build();
    }

    public HttpCookie clearAuthCookie() {
        return ResponseCookie.from("macboss_token", "") // Deixa o valor vazio
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(Duration.ZERO)
                .sameSite("Strict")
                .build();
    }

}