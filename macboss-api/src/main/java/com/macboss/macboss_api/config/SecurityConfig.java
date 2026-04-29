package com.macboss.macboss_api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.StaticHeadersWriter;

import com.macboss.macboss_api.auth.JwtAuthFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .headers(headers -> headers
                // Evita Clickjacking: Proíbe que a loja seja aberta dentro de um <iframe>
                .frameOptions(frame -> frame.deny())

                // Adiciona o cabeçalho manualmente, proibindo Câmera/GPS
                .addHeaderWriter(new StaticHeadersWriter("Permissions-Policy", "camera=(), microphone=(), geolocation=()"))
            )

            // Diz pro Spring não guardar sessão em memória (Usaremos o JWT pra isso!)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Configura as regras de permissão
            .authorizeHttpRequests(auth -> auth
                // Rota de registrar e logar são públicas (Qualquer um acessa)
                .requestMatchers("/api/v1/auth/register", "/api/v1/auth/login", "/api/v1/auth/logout", "/api/v1/auth/refresh").permitAll()

                // Qualquer outra rota do sistema, tem que ter pulseira!
                .anyRequest().authenticated()
            )
            // Coloca o nosso Segurança (JwtAuthFilter) na porta, ANTES do segurança padrão do Spring
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Criptografia BCrypt no Nível 12 (Conforme exigido na nossa auditoria LGPD/Segurança)
        return new BCryptPasswordEncoder(12);
    }
}
