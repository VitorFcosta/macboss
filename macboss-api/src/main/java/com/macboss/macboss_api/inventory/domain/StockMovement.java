package com.macboss.macboss_api.inventory.domain;

import com.macboss.macboss_api.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "stock_movements")
@Getter
@Setter
@NoArgsConstructor
public class StockMovement extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private BaseProductVariant variant;

    @Column(nullable = false)
    private Integer quantity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StockMovementType type;

    @Column(length = 255)
    private String notes;

    @Column(name = "reference_id")
    private UUID referenceId;
}
