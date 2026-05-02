package com.macboss.macboss_api.inventory.domain;

public enum StockMovementType {
    IN,       // Entrada de estoque (compra/reposição)
    RESERVE,  // Reserva (pedido criado, aguardando pagamento)
    RELEASE,  // Liberação (pedido cancelado, devolve ao estoque)
    CONSUME   // Consumo (pedido pago, estoque consumido definitivamente)
}
