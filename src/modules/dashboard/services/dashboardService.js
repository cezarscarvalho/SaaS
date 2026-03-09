import { supabase } from "../../../core/supabaseClient";

export async function getDashboardMetrics(companyId) {
    // 1. Total de vendas hoje
    const today = new Date().toISOString().split('T')[0];

    const { data: sales, error: salesError } = await supabase
        .from("pedidos")
        .select("total")
        .eq("company_id", companyId)
        .gte("created_at", today);

    // 2. Produtos com estoque baixo (menor que 5 unidades)
    const { count: lowStockCount, error: stockError } = await supabase
        .from("produtos")
        .select("*", { count: 'exact', head: true })
        .eq("company_id", companyId)
        .lt("estoque_atual", 5);

    if (salesError || stockError) throw new Error("Erro ao buscar métricas");

    const totalSalesToday = sales.reduce((acc, curr) => acc + Number(curr.total), 0);

    return {
        totalSalesToday,
        lowStockCount,
        totalOrdersToday: sales.length
    };
}