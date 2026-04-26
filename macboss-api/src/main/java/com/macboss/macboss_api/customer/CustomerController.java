package com.macboss.macboss_api.customer;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/customers")
public class CustomerController {

    // ROTA VIP 
    @GetMapping("/me")
    public ResponseEntity<String> getMyProfile(@AuthenticationPrincipal String userId) {
        return ResponseEntity.ok("Acesso Autorizado! O ID do seu Usuário é: " + userId);
    }
}
