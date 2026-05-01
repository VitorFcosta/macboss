package com.macboss.macboss_api.inventory.domain;

import com.macboss.macboss_api.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "base_product_variants")
@Getter
@Setter
@NoArgsConstructor
public class BaseProductVariant extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private BaseProduct product;

    @Column(unique = true, nullable = false, length = 50)
    private String sku;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ShirtColor color;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private ShirtSize size;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "available_qty", nullable = false)
    private Integer availableQty = 0;

    @Column(name = "min_stock_alert")
    private Integer minStockAlert = 5;
}
