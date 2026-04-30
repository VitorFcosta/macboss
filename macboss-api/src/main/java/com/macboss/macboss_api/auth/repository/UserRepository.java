package com.macboss.macboss_api.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.macboss.macboss_api.auth.domain.User;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    
    // O Spring gera o "SELECT * FROM users WHERE email = ?" automaticamente!
    Optional<User> findByEmail(String email);
    
}
