package com.macboss.macboss_api.auth;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey secretKey;
    private final long expirationTimeMs;

    // O @Value injeta as configurações do application.yml aqui pra dentro!
    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long expirationTimeMs
    ) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());
        this.expirationTimeMs = expirationTimeMs;
    }

    public String generateToken(User user) {
        return Jwts.builder()
                .subject(user.getId().toString()) 
                .claim("role", user.getRole().name()) 
                .issuedAt(new Date()) 
                .expiration(new Date(System.currentTimeMillis() + expirationTimeMs)) 
                .signWith(secretKey) 
                .compact(); 
    }

    //  Extrai o ID do Usuário (que guardamos no Subject)
    public String extractUserId(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    //  Extrai a Role do Usuário (CUSTOMER ou ADMIN)
    public String extractRole(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("role", String.class);
    }

    //  Verifica se a pulseira é falsa ou se já venceu
    public boolean isTokenValid(String token) {
        try {
            Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token);
            return true; // Se não deu erro, a pulseira é válida!
        } catch (Exception e) {
            return false; // Pulseira falsa, vencida ou corrompida.
        }
    }

    
}
