import { supabase } from "../../../core/supabaseClient";

// 1. Criar o cabeçalho do pedido
export async function createOrder(orderData) {
    const { data, error } = await supabase
        .from("pedidos")
        .insert([orderData])
        .select();

    if (error) throw error;
    return data[0];
}

// 2. Adicionar itens ao pedido
export async function addOrderItems(items) {
    const { data, error } = await supabase
        .from("itens_pedido")
        .insert(items);

    if (error) throw error;
    return data;
}

// 3. Buscar pedidos da empresa (Multi-tenant)
export async function getOrders(companyId) {
    const { data, error } = await supabase
        .from("pedidos")
        .select(`
      *,
      clientes (nome),
      itens_pedido (
        quantidade,
        preco_unitario,
        produtos (nome)
      )
    `)
        .eq("company_id", companyId)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
}