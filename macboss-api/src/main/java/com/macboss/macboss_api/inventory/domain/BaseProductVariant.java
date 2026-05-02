package com.macboss.macboss_api.inventory.domain;

import com.macboss.macboss_api.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties; 

import java.math.BigDecimal;

@Entity
@Table(name = "base_product_variants")
@Getter
@Setter
@NoArgsConstructor
public class BaseProductVariant extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
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

    @Column(name = "qty_on_hand", nullable = false)
    private Integer qtyOnHand = 0;

    @Column(name = "qty_reserved", nullable = false)
    private Integer qtyReserved = 0;

    @Column(name = "low_stock_threshold")
    private Integer lowStockThreshold = 5;

    @Column(nullable = false)
    private Boolean active = true;

    /*
        Calcula a quantidade efetivamente disponível para venda.
        qtyOnHand = total físico em mãos
        qtyReserved = quantidade presa em pedidos pendentes
    */
    public Integer getAvailableQty() {
        return qtyOnHand - qtyReserved;
    }

}
