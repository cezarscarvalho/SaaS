import { supabase } from "@/lib/supabase";

export const getDashboardMetrics = async (companyId) => {
    try {
        // 1. Total de Produtos
        const { count: totalProdutos } = await supabase
            .from('produtos')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', companyId);

        // 2. Alerta de Estoque Baixo (Exemplo: menos de 5 unidades)
        const { count: estoqueBaixo } = await supabase
            .from('produtos')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', companyId)
            .lt('estoque_atual', 5);

        // Aqui você pode adicionar buscas de vendas, faturamento, etc.

        return {
            totalProdutos: totalProdutos || 0,
            estoqueBaixo: estoqueBaixo || 0,
            vendasHoje: 0, // Placeholder para quando criarmos a tabela de vendas
            faturamento: 0  // Placeholder
        };
    } catch (error) {
        console.error("Erro ao carregar métricas:", error);
        return null;
    }
};