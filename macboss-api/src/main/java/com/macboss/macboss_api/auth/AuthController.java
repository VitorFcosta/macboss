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

    // O Spring injeta os dois serviços aqui automaticamente
    public AuthController(AuthService authService, CookieService cookieService) {
        this.authService = authService;
        this.cookieService = cookieService;
    }

    @PostMapping("/register")
    // continuamos devolvendo SÓ o UserResponseDTO no corpo da resposta
    public ResponseEntity<UserResponseDTO> register(
            @Valid @RequestBody RegisterRequestDTO request,
            HttpServletRequest httpRequest
    ) {
        String ipAddress = httpRequest.getRemoteAddr();

        // Manda a Cozinha trabalhar e recebe a Bandeja com as duas coisas
        AuthResponseDTO responseTray = authService.register(request, ipAddress);

        // Pega só a pulseira que veio na Bandeja e tranca no Cofre (Cookie)
        HttpCookie authCookie = cookieService.createAuthCookie(responseTray.jwt());

        // Devolve a resposta pro React:
        // O Cookie vai escondido no Cabeçalho (Header: SET_COOKIE)
        // Os dados do Usuário vão abertos no Corpo (Body)
        return ResponseEntity.status(HttpStatus.CREATED)
                .header(HttpHeaders.SET_COOKIE, authCookie.toString())
                .body(responseTray.user());
    }
    @PostMapping("/login")
    public ResponseEntity<UserResponseDTO> login(@Valid @RequestBody com.macboss.macboss_api.auth.dto.LoginRequestDTO request) {
        
        // Manda a Cozinha processar o Login e recebe a Bandeja
        AuthResponseDTO responseTray = authService.login(request);

        // Pega a pulseira nova e tranca no Cofre (Cookie)
        org.springframework.http.HttpCookie authCookie = cookieService.createAuthCookie(responseTray.jwt());

        // Devolve exatamente da mesma forma: Cookie no Cabeçalho e Usuário no Corpo
        return ResponseEntity.status(org.springframework.http.HttpStatus.OK) // Status 200 OK 
                .header(org.springframework.http.HttpHeaders.SET_COOKIE, authCookie.toString())
                .body(responseTray.user());
    }

}
