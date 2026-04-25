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
}
