package com.macboss.macboss_api.inventory.repository;

import com.macboss.macboss_api.inventory.domain.BaseProductVariant;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BaseProductVariantRepository extends JpaRepository<BaseProductVariant, UUID> {

    Optional<BaseProductVariant> findBySkuAndActiveTrue(String sku);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT v FROM BaseProductVariant v WHERE v.id = :id")
    Optional<BaseProductVariant> findByIdForStockUpdate(@Param("id") UUID id);

    @Query("SELECT v FROM BaseProductVariant v WHERE (v.qtyOnHand - v.qtyReserved) <= v.lowStockThreshold AND v.active = true")
    List<BaseProductVariant> findLowStockVariants();

    List<BaseProductVariant> findAllByActiveTrue();

}
