import { supabase } from "../core/supabaseClient"; // Ajuste o caminho conforme seu projeto

const handleAddProduct = async (productData) => {
    try {
        // 1. Pega o usuário logado (A identidade do lojista)
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) throw new Error("Usuário não autenticado");

        // 2. Prepara os dados incluindo o company_id (UUID)
        const newProduct = {
            ...productData,
            company_id: user.id, // O segredo da blindagem está aqui!
            preco: parseFloat(productData.preco), // Garante que é número decimal
            estoque_atual: parseInt(productData.estoque_atual)
        };

        // 3. Envia para o banco blindado
        const { data, error } = await supabase
            .from('produtos')
            .insert([newProduct])
            .select();

        if (error) throw error;

        console.log("✅ Produto cadastrado com sucesso:", data);
        alert("Produto salvo na sua Tabacaria!");

    } catch (error) {
        console.error("❌ Erro no cadastro:", error.message);
        alert("Erro ao salvar: " + error.message);
    }
};