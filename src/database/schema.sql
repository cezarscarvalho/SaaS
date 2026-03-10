-- ==========================================================
-- SCHEMA COMPLETO DO PROJETO SAAS TABACARIA
-- Criado por: Cezar (Gestor de TI)
-- ==========================================================

-- 1. TABELA DE EMPRESAS (Estrutura Multi-Tenancy)
CREATE TABLE IF NOT EXISTS empresas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  nome_fantasia TEXT NOT NULL,
  cnpj TEXT UNIQUE,
  plano TEXT DEFAULT 'basic' -- 'basic', 'pro', 'enterprise'
);

-- 2. TABELA DE PRODUTOS (Inventário Central)
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  stock INTEGER DEFAULT 0,
  category TEXT DEFAULT 'Tabaco',
  image_url TEXT,
  empresa_id UUID REFERENCES empresas(id) -- Vínculo para separar dados por loja
);

-- 3. TABELA DE VENDAS (Cabeçalho Financeiro)
CREATE TABLE IF NOT EXISTS sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  total_value NUMERIC NOT NULL,
  payment_method TEXT NOT NULL, -- 'Dinheiro', 'Pix', 'Cartão'
  empresa_id UUID REFERENCES empresas(id)
);

-- 4. TABELA DE ITENS DA VENDA (Detalhes das Transações)
CREATE TABLE IF NOT EXISTS sales_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price NUMERIC NOT NULL
);

-- 5. AUTOMAÇÃO: FUNÇÃO PARA BAIXA DE ESTOQUE
-- Esta função é chamada automaticamente após cada venda inserida
CREATE OR REPLACE FUNCTION atualizar_estoque_pos_venda()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET stock = stock - NEW.quantity
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. TRIGGER DE BAIXA AUTOMÁTICA
-- Vincula a função acima à tabela de itens de venda
CREATE OR REPLACE TRIGGER trigger_baixa_estoque
AFTER INSERT ON sales_items
FOR EACH ROW
EXECUTE FUNCTION atualizar_estoque_pos_venda();