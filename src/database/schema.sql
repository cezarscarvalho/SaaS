-- ==========================================================
-- SCHEMA MASTER - PROJETO SAAS TABACARIA PRO
-- Versão: 1.6 (Estável)
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
  role TEXT DEFAULT 'vendedor', -- Níveis: 'admin' ou 'vendedor'
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
  empresa_id UUID REFERENCES empresas(id)
);

CREATE TABLE IF NOT EXISTS sales_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price NUMERIC NOT NULL
);

-- 5. INTELIGÊNCIA E AUTOMAÇÕES (Triggers & Functions)

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

-- B. Criação Automática de Perfil
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

-- 6. POLÍTICAS DE SEGURANÇA (RLS)
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can update company" ON empresas FOR UPDATE 
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Admins can delete company" ON empresas FOR DELETE 
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- 7. OTIMIZAÇÃO E PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_empresa ON products(empresa_id);

-- ==========================================================
-- GUIA RÁPIDO DE MANUTENÇÃO (SQL Editor)
-- ==========================================================
/*
  -- PROMOVER ADMIN:
  UPDATE profiles SET role = 'admin', empresa_id = (SELECT id FROM empresas LIMIT 1) 
  WHERE id = 'SEU_UUID_AQUI';

  -- VERIFICAR CONEXÃO:
  SELECT p.full_name, p.role, e.nome_fantasia 
  FROM profiles p JOIN empresas e ON p.empresa_id = e.id;
*/