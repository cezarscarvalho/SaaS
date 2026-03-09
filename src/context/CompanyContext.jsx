import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // Verifique se o arquivo é supabase.js (minúsculo)

const CompanyContext = createContext();

export function CompanyProvider({ children }) {
    const [session, setSession] = useState(null);
    const [companyId, setCompanyId] = useState(null);
    const [role, setRole] = useState(null);
    const [loadingCompany, setLoadingCompany] = useState(true);

    // 1. Gerenciar Sessão
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    // 2. Carregar Empresa (Alinhado com a Blindagem)
    useEffect(() => {
        if (!session) {
            setLoadingCompany(false);
            return;
        }

        async function loadCompany() {
            setLoadingCompany(true);
            try {
                // Como blindamos a tabela 'empresas' com (owner_id = auth.uid())
                // podemos buscar direto nela!
                const { data: empresa, error } = await supabase
                    .from("empresas")
                    .select("id")
                    .eq("owner_id", session.user.id)
                    .single();

                if (error && error.code === "PGRST116") {
                    // Se não existe, cria a empresa (O ID será o UUID que configuramos)
                    const { data: nova, error: errCriar } = await supabase
                        .from("empresas")
                        .insert([{ nome: "Minha Tabacaria", owner_id: session.user.id }])
                        .select()
                        .single();

                    if (!errCriar) setCompanyId(nova.id);
                } else if (empresa) {
                    setCompanyId(empresa.id);
                }

                setRole("owner"); // Por padrão, quem está no empresas é owner
            } catch (err) {
                console.error("Erro no Contexto:", err);
            } finally {
                setLoadingCompany(false);
            }
        }

        loadCompany();
    }, [session]);

    return (
        <CompanyContext.Provider value={{ companyId, role, loadingCompany, session }}>
            {children}
        </CompanyContext.Provider>
    );
}

export function useCompany() {
    return useContext(CompanyContext);
}