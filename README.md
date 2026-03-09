# Tabacaria SaaS 🚀

Sistema de gestão multi-tenant focado em tabacarias, desenvolvido com **React, Supabase e Tailwind CSS**.

## 🛠️ Arquitetura e Segurança
- **Multi-tenancy**: Isolamento completo de dados por empresa via RLS (Row Level Security).
- **RBAC (Role-Based Access Control)**: Níveis de permissão distintos para `owner`, `admin` e `staff`.
- **Arquitetura Modular**: Estrutura organizada por módulos para facilitar a escalabilidade para outros nichos (Pizzarias, Lojas, etc).

## 🚀 Funcionalidades
- Dashboard com KPIs em tempo real.
- Gestão de estoque com upload de imagens via Supabase Storage.
- PDV integrado com baixa automática de estoque via Triggers SQL.
