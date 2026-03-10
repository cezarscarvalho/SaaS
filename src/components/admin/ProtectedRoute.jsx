import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function ProtectedRoute({ children, adminOnly = false }) {
    const [session, setSession] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                setSession(session);
                // Busca o cargo (role) do usuário na nossa tabela de perfis
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();

                setProfile(profileData);
            }
            setLoading(false);
        };

        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-indigo-600"></div>
            </div>
        );
    }

    // Se não estiver logado, vai para o login
    if (!session) return <Navigate to="/login" replace />;

    // Se a rota for apenas para Admin e o usuário for Vendedor, bloqueia
    if (adminOnly && profile?.role !== 'admin') {
        return <Navigate to="/access-denied" replace />;
    }

    return children;
}