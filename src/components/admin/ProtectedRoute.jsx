import LoadingScreen from "../LoadingScreen";
import { Navigate } from "react-router-dom";
import { supabase } from "../../lib/supabase"; // Saia de admin, saia de components e entre em lib
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Checa a sessão atual ao carregar
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();
            setSession(data.session);
            setLoading(false);
        };

        checkSession();

        // 2. ESCUTA mudanças (Login/Logout) em tempo real
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });

        // Limpa o "ouvinte" ao fechar o componente
        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0f172a] text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
            </div>
        );
    }
    if (loading) return <LoadingScreen />;
    if (!session) {
        return <Navigate to="/login" replace />;
    }

    return children;
}