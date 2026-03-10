-- ==========================================================
-- SCHEMA MASTER - PROJETO SAAS TABACARIA PRO
-- Versão: 2.0 (Financeiro & Fluxo de Caixa)
-- Responsável: Cezar (Gestor de TI)
-- Data da Última Revisão: 10/03/2026
-- ==========================================================

-- 1. ESTRUTURA CORPORATIVA (Multi-Tenancy)
CREATE TABLE IF NOT EXISTS empresas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  nome_fantasia TEXT NOT NULL,
  cnpj TEXT UNIQUE,
  endereco TEXT,
  telefone TEXT,
  plano TEXT DEFAULT 'basic'
);

-- 2. GESTÃO DE USUÁRIOS E PERMISSÕES (RBAC)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  full_name TEXT,
  role TEXT DEFAULT 'vendedor', -- 'admin' ou 'vendedor'
  empresa_id UUID REFERENCES empresas(id)
);

-- 3. INVENTÁRIO E PRODUTOS
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  stock INTEGER DEFAULT 0,
  category TEXT DEFAULT 'Tabaco',
  image_url TEXT,
  empresa_id UUID REFERENCES empresas(id)
);

-- 4. MOVIMENTAÇÃO FINANCEIRA (Vendas)
CREATE TABLE IF NOT EXISTS sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  total_value NUMERIC NOT NULL,
  payment_method TEXT NOT NULL, -- 'Dinheiro', 'Pix', 'Cartão'
  status TEXT DEFAULT 'finalizada', -- 'finalizada' ou 'cancelada'
  motivo_cancelamento TEXT,
  cancelado_por UUID REFERENCES auth.users(id),
  empresa_id UUID REFERENCES empresas(id)
);

CREATE TABLE IF NOT EXISTS sales_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price NUMERIC NOT NULL
);

-- 5. CONTROLE DE FLUXO DE CAIXA
CREATE TABLE IF NOT EXISTS cashier_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  opened_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  closed_at TIMESTAMP WITH TIME ZONE,
  opening_balance NUMERIC DEFAULT 0, -- Dinheiro inicial (troco)
  closing_balance NUMERIC,           -- Dinheiro final contado
  opened_by UUID REFERENCES auth.users(id),
  empresa_id UUID REFERENCES empresas(id)
);

-- 6. INTELIGÊNCIA E AUTOMAÇÕES (Triggers)

-- A. Baixa Automática de Estoque
CREATE OR REPLACE FUNCTION atualizar_estoque_pos_venda()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products SET stock = stock - NEW.quantity WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_baixa_estoque
AFTER INSERT ON sales_items FOR EACH ROW EXECUTE FUNCTION atualizar_estoque_pos_venda();

-- B. Estorno de Estoque em Cancelamento
CREATE OR REPLACE FUNCTION estornar_estoque_cancelamento()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.status = 'cancelada' AND OLD.status = 'finalizada') THEN
    UPDATE products
    SET stock = stock + item.quantity
    FROM sales_items item
    WHERE item.product_id = products.id AND item.sale_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_estorno_estoque
AFTER UPDATE ON sales FOR EACH ROW EXECUTE FUNCTION estornar_estoque_cancelamento();

-- C. Criação Automática de Perfil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'vendedor');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 7. OTIMIZAÇÃO E SEGURANÇA
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_empresa ON products(empresa_id);

-- ==========================================================
-- GUIA RÁPIDO DE MANUTENÇÃO (v2.0)
-- ==========================================================
/*
  -- RESET DE SEGURANÇA (Se der erro 403):
  ALTER TABLE sales DISABLE ROW LEVEL SECURITY;
  
  -- VINCULAR ADMIN À EMPRESA:
  UPDATE profiles SET role = 'admin', empresa_id = (SELECT id FROM empresas LIMIT 1) 
  WHERE id = '61fc746d-83fb-4b4f-8131-3293115759d6';

  -- AUDITORIA DE FECHAMENTO:
  SELECT payment_method, SUM(total_value) FROM sales 
  WHERE created_at >= (SELECT opened_at FROM cashier_sessions WHERE closed_at IS NULL)
  GROUP BY payment_method;
*/