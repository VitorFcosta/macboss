package com.macboss.macboss_api.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpCookie;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;
import java.time.Duration;

@Service
public class CookieService {

    private final long expirationTimeMs;
    private final long refreshExpirationTimeMs; 

    public CookieService(
            @Value("${jwt.expiration}") long expirationTimeMs,
            @Value("${jwt.refresh-expiration}") long refreshExpirationTimeMs
    ) {
        this.expirationTimeMs = expirationTimeMs;
        this.refreshExpirationTimeMs = refreshExpirationTimeMs;
    }

    // Cofre 1:  (Access Token)
    public HttpCookie createAccessTokenCookie(String jwt) {
        return ResponseCookie.from("macboss_access_token", jwt)
                .httpOnly(true)
                .secure(false) // Produção vira TRUE
                .path("/")     // Válido no site todo
                .maxAge(Duration.ofMillis(expirationTimeMs))
                .sameSite("Strict")
                .build();
    }

    // Cofre 2:  (Refresh Token)
    public HttpCookie createRefreshTokenCookie(String jwt) {
        return ResponseCookie.from("macboss_refresh_token", jwt)
                .httpOnly(true)
                .secure(false) 
                // Esse cookie SÓ viaja pela internet nessa Rota exata!
                .path("/api/v1/auth/refresh") 
                .maxAge(Duration.ofMillis(refreshExpirationTimeMs))
                .sameSite("Strict")
                .build();
    }

    // Esvazia os dois Cofres (Para a Rota de Logout)
    public HttpCookie[] clearAuthCookies() {
        HttpCookie access = ResponseCookie.from("macboss_access_token", "")
                .httpOnly(true).secure(false).path("/").maxAge(Duration.ZERO).sameSite("Strict").build();
                
        HttpCookie refresh = ResponseCookie.from("macboss_refresh_token", "")
                .httpOnly(true).secure(false).path("/api/v1/auth/refresh").maxAge(Duration.ZERO).sameSite("Strict").build();
                
        return new HttpCookie[]{access, refresh}; // Retorna os dois vazios de uma vez
    }
}
