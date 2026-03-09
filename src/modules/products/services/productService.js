import { supabase } from "@/lib/supabase";

export const createProduct = async (productData) => {
    // productData deve conter: nome, preco, estoque_atual, company_id
    const { data, error } = await supabase
        .from('produtos')
        .insert([productData])
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const getProducts = async (companyId) => {
    const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};