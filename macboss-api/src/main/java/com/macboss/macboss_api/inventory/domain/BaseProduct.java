package com.macboss.macboss_api.inventory.domain;

import com.macboss.macboss_api.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "base_products")
@Getter
@Setter
@NoArgsConstructor
public class BaseProduct extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ProductType type;

    @Column(nullable = false)
    private boolean active = true;
}
