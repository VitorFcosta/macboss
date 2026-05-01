package com.macboss.macboss_api.inventory.repository;

import com.macboss.macboss_api.inventory.domain.BaseProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface BaseProductRepository extends JpaRepository<BaseProduct, UUID> {
}
