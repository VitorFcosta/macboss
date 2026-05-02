
-- 1. Renomear colunas em base_product_variants
ALTER TABLE base_product_variants RENAME COLUMN available_qty TO qty_on_hand;
ALTER TABLE base_product_variants ADD COLUMN qty_reserved INTEGER NOT NULL DEFAULT 0;
ALTER TABLE base_product_variants RENAME COLUMN min_stock_alert TO low_stock_threshold;

-- 2. Renomear colunas em stock_movements
ALTER TABLE stock_movements RENAME COLUMN reason TO notes;
ALTER TABLE stock_movements ADD COLUMN reference_id UUID;

-- 3. Migrar tipos de movimentação antigos para o novo enum
UPDATE stock_movements SET type = 'IN' WHERE type IN ('RETURN');
UPDATE stock_movements SET type = 'CONSUME' WHERE type IN ('OUT', 'LOSS', 'ADJUSTMENT');
