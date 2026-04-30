package com.macboss.macboss_api.auth.web.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.macboss.macboss_api.auth.service.JwtService;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        //Procura em todos os cookies enviados pelo navegador um chamado "macboss_token"
        String token = null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("macboss_access_token".equals(cookie.getName())) {
                    token = cookie.getValue();
                }
            }
        }

        //Se achou o token e ele passou no teste
        if (token != null && jwtService.isTokenValid(token)) {
            
            //Lê na pulseira quem é o dono (ID) e a permissão dele (Role)
            String userId = jwtService.extractUserId(token);
            String role = jwtService.extractRole(token);

            //Cria o "Carimbo Oficial" do Spring Security (ex: "ROLE_CUSTOMER")
            SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);
            
            //Preenche a ficha do usuário autenticado (Sem senha, porque o JWT já é a prova)
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userId, 
                    null, 
                    Collections.singletonList(authority) 
            );

            //Coloca o Carimbo na porta: "Pode deixar esse usuário passar!"
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        //Manda a requisição continuar andando (vai pro Controller ou será bloqueada se faltou o carimbo)
        filterChain.doFilter(request, response);
    }
}
