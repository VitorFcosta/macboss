package com.macboss.macboss_api.auth;

// (PASSO 1) Importamos a nossa "Bandeja"
import com.macboss.macboss_api.auth.dto.AuthResponseDTO;
import com.macboss.macboss_api.auth.dto.RegisterRequestDTO;
import com.macboss.macboss_api.auth.dto.UserResponseDTO;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    // (PASSO 2) Trazemos a máquina de pulseiras (JwtService) pra dentro da Cozinha
    private final JwtService jwtService; 

    // O Spring injeta as ferramentas automaticamente aqui dentro
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    // (PASSO 3) Avisamos que agora o método devolve a "Bandeja" inteira (AuthResponseDTO)
    public AuthResponseDTO register(RegisterRequestDTO dto, String ipAddress) {
        
        if (userRepository.findByEmail(dto.email()).isPresent()) {
            throw new IllegalArgumentException("Este e-mail já está em uso."); 
        }

        User newUser = User.builder()
                .name(dto.name())
                .email(dto.email())
                .passwordHash(passwordEncoder.encode(dto.password()))
                .role(Role.CUSTOMER)
                .active(true)
                .consentGivenAt(ZonedDateTime.now())
                .consentIp(ipAddress)
                .consentVersion("v1.0")
                .build();

        User savedUser = userRepository.save(newUser);

        // (PASSO 3) Fabricamos a pulseira JWT!
        String token = jwtService.generateToken(savedUser);

        // Empacotamos os dados do usuário (Sem a senha, por segurança)
        UserResponseDTO userResponse = new UserResponseDTO(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole().name()
        );

        // (PASSO 3) Colocamos o usuário e o token juntos na Bandeja e devolvemos pro Garçom!
        return new AuthResponseDTO(userResponse, token);
    }
}
