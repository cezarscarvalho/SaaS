// Trecho da função handleOpenCashier no seu CashierControl.jsx
const handleOpenCashier = async () => {
    if (!openingValue) return alert("Digite o valor inicial!");

    // Pega o ID da empresa do perfil do usuário logado
    const { data: profile } = await supabase.auth.getUser();
    const { data: userProfile } = await supabase
        .from('profiles')
        .select('empresa_id')
        .eq('id', profile.user.id)
        .single();

    const { data, error } = await supabase
        .from('cashier_sessions')
        .insert([{
            opening_balance: Number(openingValue),
            opened_at: new Date().toISOString(),
            opened_by: profile.user.id,
            empresa_id: userProfile?.empresa_id // VINCULO CRITÍCO
        }])
        .select().single();

    if (error) {
        console.error("Erro ao abrir caixa:", error);
        alert("Erro ao abrir caixa. Verifique o console.");
    } else {
        setCashier(data);
    }
};