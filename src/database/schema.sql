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

-- 7. TABELA DE PERFIS (Extensão do Auth.Users)
-- Gerencia cargos e vínculo com empresas
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  full_name TEXT,
  role TEXT DEFAULT 'vendedor', -- 'admin' ou 'vendedor'
  empresa_id UUID REFERENCES empresas(id)
);

-- 8. AUTOMAÇÃO: CRIAR PERFIL AUTOMÁTICO
-- Sempre que um usuário confirmar o e-mail, o Supabase cria o perfil dele aqui
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'vendedor');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

  -- ==========================================================
-- SEÇÃO DE MANUTENÇÃO E GESTÃO DE ACESSOS (GUIA RÁPIDO)
-- Use estes comandos no SQL Editor do Supabase para gestão manual
-- ==========================================================

/* 1. LISTAR TODOS OS USUÁRIOS E SEUS CARGOS:
  SELECT id, full_name, role FROM public.profiles;

  2. PROMOVER UM USUÁRIO A ADMINISTRADOR:
  -- (Substitua o UUID pelo ID real do usuário)
  UPDATE public.profiles 
  SET role = 'admin' 
  WHERE id = 'SEU_UUID_AQUI';

  3. REBAIXAR UM USUÁRIO A VENDEDOR:
  UPDATE public.profiles 
  SET role = 'vendedor' 
  WHERE id = 'SEU_UUID_AQUI';

  4. VINCULAR UM USUÁRIO A UMA EMPRESA ESPECÍFICA:
  UPDATE public.profiles 
  SET empresa_id = 'UUID_DA_EMPRESA' 
  WHERE id = 'UUID_DO_USUARIO';
*/

-- DICA DE SEGURANÇA: 
-- O Trigger 'on_auth_user_created' garante que todo novo cadastro 
-- comece como 'vendedor' por padrão (Princípio do Privilégio Mínimo).