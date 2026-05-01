package com.macboss.macboss_api.inventory.domain;

public enum StockMovementType {
    IN,         // Entrada de estoque (compra/reposição)
    OUT,        // Saída (venda)
    ADJUSTMENT, // Ajuste manual (correção de erro)
    RETURN,     // Retorno (devolução de cliente)
    LOSS        // Perda (produto danificado ou extraviado)
}
