package com.macboss.macboss_api.auth;

import com.macboss.macboss_api.auth.dto.AuthResponseDTO;
import com.macboss.macboss_api.auth.dto.RegisterRequestDTO;
import com.macboss.macboss_api.auth.dto.UserResponseDTO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final CookieService cookieService; 

    public AuthController(AuthService authService, CookieService cookieService) {
        this.authService = authService;
        this.cookieService = cookieService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(
            @Valid @RequestBody RegisterRequestDTO request,
            jakarta.servlet.http.HttpServletRequest httpRequest
    ) {
        String ipAddress = httpRequest.getRemoteAddr();
        AuthResponseDTO responseTray = authService.register(request, ipAddress);

        // Tranca as DUAS pulseiras nos seus respectivos cofres
        HttpCookie accessCookie = cookieService.createAccessTokenCookie(responseTray.accessToken());
        HttpCookie refreshCookie = cookieService.createRefreshTokenCookie(responseTray.refreshToken());

        return ResponseEntity.status(HttpStatus.CREATED)
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString()) // Adiciona o segundo cookie na resposta!
                .body(responseTray.user());
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponseDTO> login(@Valid @RequestBody com.macboss.macboss_api.auth.dto.LoginRequestDTO request) {
        AuthResponseDTO responseTray = authService.login(request);

        // Tranca as DUAS pulseiras
        HttpCookie accessCookie = cookieService.createAccessTokenCookie(responseTray.accessToken());
        HttpCookie refreshCookie = cookieService.createRefreshTokenCookie(responseTray.refreshToken());

        return ResponseEntity.status(HttpStatus.OK) 
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString()) // Envia os dois pro React
                .body(responseTray.user());
    }
    @PostMapping("/refresh")
    public ResponseEntity<UserResponseDTO> refresh(@CookieValue(name = "macboss_refresh_token", required = false) String refreshToken) {
        if (refreshToken == null) {
            // Se o cara tentar renovar mas não trouxe o Vale-Pulseira, 401 Nele!
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            // Manda a Cozinha renovar tudo
            AuthResponseDTO responseTray = authService.refreshToken(refreshToken);

            // Tranca as novas pulseiras nos cofres
            HttpCookie accessCookie = cookieService.createAccessTokenCookie(responseTray.accessToken());
            HttpCookie newRefreshCookie = cookieService.createRefreshTokenCookie(responseTray.refreshToken());

            // Devolve os cofres trancados
            return ResponseEntity.status(HttpStatus.OK)
                    .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                    .header(HttpHeaders.SET_COOKIE, newRefreshCookie.toString())
                    .body(responseTray.user());
        } catch (IllegalArgumentException e) {
            // Se o Vale-Pulseira for falso ou estiver vencido, 401 nele também!
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }


    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        // Pega os dois cofres vazios e envia para destruir o que o cliente tem no navegador
        HttpCookie[] clearCookies = cookieService.clearAuthCookies();

        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .header(HttpHeaders.SET_COOKIE, clearCookies[0].toString())
                .header(HttpHeaders.SET_COOKIE, clearCookies[1].toString())
                .build();
    }


}
