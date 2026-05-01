package com.macboss.macboss_api.inventory.repository;

import com.macboss.macboss_api.inventory.domain.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, UUID> {
    List<StockMovement> findByVariantIdOrderByCreatedAtDesc(UUID variantId);
}
