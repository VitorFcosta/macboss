package com.macboss.macboss_api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Desabilita CSRF porque usaremos Cookies JWT com SameSite=Strict mais pra frente
            .csrf(csrf -> csrf.disable())
            
            // A API não vai guardar memória de quem logou (Stateless). O Cookie JWT fará isso.
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // Regras de acesso às rotas
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll() // Libera acesso público ao Cadastro e Login
                .requestMatchers("/actuator/health").permitAll() // Libera verificação de saúde do sistema
                .anyRequest().authenticated() // Exige login para todas as outras rotas!
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Criptografia BCrypt no Nível 12 (Conforme exigido na nossa auditoria LGPD/Segurança)
        return new BCryptPasswordEncoder(12);
    }
}
