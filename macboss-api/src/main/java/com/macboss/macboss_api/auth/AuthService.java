package com.macboss.macboss_api.auth;

import com.macboss.macboss_api.auth.dto.AuthResponseDTO;
import com.macboss.macboss_api.auth.dto.RegisterRequestDTO;
import com.macboss.macboss_api.auth.dto.UserResponseDTO;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.concurrent.TimeUnit;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService; 
    
    // Ferramenta que fala com o Redis
    private final StringRedisTemplate redisTemplate; 

    public AuthService(UserRepository userRepository, 
                       PasswordEncoder passwordEncoder, 
                       JwtService jwtService,
                       StringRedisTemplate redisTemplate) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.redisTemplate = redisTemplate;
    }

    @Transactional
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

        String accessToken = jwtService.generateAccessToken(savedUser);
        String refreshToken = jwtService.generateRefreshToken(savedUser);

        UserResponseDTO userResponse = new UserResponseDTO(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole().name()
        );
        return new AuthResponseDTO(userResponse, accessToken, refreshToken);

    }

    public AuthResponseDTO login(com.macboss.macboss_api.auth.dto.LoginRequestDTO dto) {
        
        // ESCUDO ANTI-FORÇA BRUTA: Checa no Redis se a pessoa já errou a senha 5 vezes
        String redisKey = "login_attempts:" + dto.email();
        String attemptsStr = redisTemplate.opsForValue().get(redisKey);
        
        if (attemptsStr != null && Integer.parseInt(attemptsStr) >= 5) {
            throw new IllegalArgumentException("Conta temporariamente bloqueada por segurança. Tente novamente em 15 minutos.");
        }

        // Tenta achar o usuário pelo e-mail
        User user = userRepository.findByEmail(dto.email())
                .orElseThrow(() -> new IllegalArgumentException("E-mail ou senha incorretos."));

        // Compara a senha digitada com a criptografia salva no banco
        boolean isPasswordCorrect = passwordEncoder.matches(dto.password(), user.getPasswordHash());
        
        if (!isPasswordCorrect) {
            //ERROU A SENHA! Vamos anotar esse erro no Redis
            Long newAttempts = redisTemplate.opsForValue().increment(redisKey);
            
            // Se foi o primeiro erro da pessoa, a gente configura o prazo de 15 minutos de bloqueio
            if (newAttempts != null && newAttempts == 1) {
                redisTemplate.expire(redisKey, 15, TimeUnit.MINUTES);
            }
            throw new IllegalArgumentException("E-mail ou senha incorretos."); 
        }

        // Vamos perdoar os erros apagando o registro do Redis
        redisTemplate.delete(redisKey);

        // Tudo certo! Fabrica uma nova pulseira
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        // Prepara os dados dele
        UserResponseDTO userResponse = new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );

        // Devolve na mesma Bandeja!
        return new AuthResponseDTO(userResponse, accessToken, refreshToken);
    }
    public AuthResponseDTO refreshToken(String refreshToken) {
        // Verifica se mandaram um token e se ele é verdadeiro
        if (refreshToken == null || !jwtService.isTokenValid(refreshToken)) {
            throw new IllegalArgumentException("Refresh token inválido ou expirado."); 
        }

        // Extrai de quem é esse token e busca no banco
        String userIdStr = jwtService.extractUserId(refreshToken);
        User user = userRepository.findById(java.util.UUID.fromString(userIdStr))
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

        // Fabrica um par de pulseiras novinhas em folha (Token Rotation)
        String newAccessToken = jwtService.generateAccessToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user); 

        UserResponseDTO userResponse = new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );

        // Devolve na bandeja
        return new AuthResponseDTO(userResponse, newAccessToken, newRefreshToken);
    }
    
}
