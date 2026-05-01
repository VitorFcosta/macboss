-- Tabela de Produtos Base
CREATE TABLE base_products (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by VARCHAR(255),
    last_modified_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME_ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME_ZONE NOT NULL
);

-- Tabela de Variantes (onde fica o estoque real)
CREATE TABLE base_product_variants (
    id UUID PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES base_products(id),
    sku VARCHAR(50) NOT NULL UNIQUE,
    color VARCHAR(20) NOT NULL,
    size VARCHAR(10) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    available_qty INTEGER NOT NULL DEFAULT 0,
    min_stock_alert INTEGER NOT NULL DEFAULT 5,
    created_by VARCHAR(255),
    last_modified_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME_ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME_ZONE NOT NULL
);

-- Tabela de Histórico de Movimentação
CREATE TABLE stock_movements (
    id UUID PRIMARY KEY,
    variant_id UUID NOT NULL REFERENCES base_product_variants(id),
    quantity INTEGER NOT NULL,
    type VARCHAR(20) NOT NULL,
    reason VARCHAR(255),
    created_by VARCHAR(255),
    last_modified_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME_ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME_ZONE NOT NULL
);

-- Índices para performance
CREATE INDEX idx_variants_product_id ON base_product_variants(product_id);
CREATE INDEX idx_movements_variant_id ON stock_movements(variant_id);
