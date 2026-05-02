package com.macboss.macboss_api.inventory.repository;

import com.macboss.macboss_api.inventory.domain.BaseProductVariant;

import jakarta.persistence.Column;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BaseProductVariantRepository extends JpaRepository<BaseProductVariant, UUID> {

    Optional<BaseProductVariant> findBySkuAndActiveTrue(String sku);

    @Query("SELECT v FROM BaseProductVariant v WHERE (v.qtyOnHand - v.qtyReserved) <= v.lowStockThreshold AND v.active = true")
    List<BaseProductVariant> findLowStockVariants();

    List<BaseProductVariant> findAllByActiveTrue();

}
