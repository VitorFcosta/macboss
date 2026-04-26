package com.macboss.macboss_api.auth;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    // Armazena um "Balde" de fichas de acesso para cada IP diferente
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // A regra do Guarda: Eu só quero policiar a porta de Entrada do Login
        if (request.getRequestURI().startsWith("/api/v1/auth/login")) {
            
            String ip = request.getRemoteAddr(); // Pega o IP (Placa do Carro) do usuário
            
            // Se esse IP for novo, entrega um Balde novo pra ele (com as 5 fichas)
            Bucket bucket = buckets.computeIfAbsent(ip, this::createNewBucket);

            // Tenta pegar 1 ficha do Balde desse IP
            if (bucket.tryConsume(1)) {
                // Tem ficha! O Guarda levanta a cancela e deixa ir para a Cozinha tentar fazer o Login
                filterChain.doFilter(request, response);
            } else {
                // Balde Vazio! Gastou as 5 tentativas em menos de 1 minuto.
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value()); // Devolve um HTTP 429
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Muitas tentativas detectadas (Rate Limit). Aguarde 1 minuto.\"}");
            }
        } else {
            // Se for outra rota (ex: cadastrar ou Rota VIP), o Guarda ignora e deixa passar direto
            filterChain.doFilter(request, response);
        }
    }

    // Regra oficial da Mac Boss (CRIT-02): 5 fichas que recarregam a cada 1 minuto!
    private Bucket createNewBucket(String key) {
        Bandwidth limit = Bandwidth.builder()
                .capacity(5) // Tamanho do balde (Máximo de 5 fichas)
                .refillGreedy(5, Duration.ofMinutes(1)) // Coloca 5 fichas novas a cada 1 minuto
                .build();

        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

}
