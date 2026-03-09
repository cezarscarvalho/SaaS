import { supabase } from "@/lib/supabase";

export const registrarVenda = async (vendaData) => {
    // vendaData: { company_id, produto_id, quantidade, valor_total, vendedor_id }
    const { data, error } = await supabase
        .from('vendas')
        .insert([vendaData])
        .select();

    if (error) throw error;
    return data;
};