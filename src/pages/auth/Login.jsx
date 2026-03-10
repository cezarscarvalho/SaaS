import React, { useState } from 'react';
import { supabase } from "@/lib/supabase";
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (authError) throw authError;

            // Se logou com sucesso, o CompanyContext vai detectar a sessão 
            // e carregar os dados da empresa automaticamente.
            navigate('/admin');

        } catch (err) {
            console.error("Erro na autenticação:", err.message);
            setError("E-mail ou senha incorretos. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

                {/* Header do Card */}
                <div className="p-8 text-center bg-indigo-600 text-white">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                        <LogIn size={32} />
                    </div>
                    <h1 className="text-2xl font-bold">Acesso ao SaaS</h1>
                    <p className="text-indigo-100 mt-2 text-sm italic">Gestão de Tabacaria & Comércio</p>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="mb-6 flex items-center gap-2 p-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-100 animate-shake">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Campo E-mail */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">E-mail Corporativo</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    placeholder="seu@email.com"
                                />
                            </div>
                        </div>

                        {/* Campo Senha */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sua Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Botão de Entrar */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:shadow-none"
                        >
                            {loading ? (
                                <><Loader2 className="animate-spin" size={20} /> Autenticando...</>
                            ) : (
                                "Entrar no Sistema"
                            )}
                        </button>
                    </form>

                    {/* Rodapé do Login */}
                    <p className="mt-8 text-center text-xs text-gray-400 uppercase tracking-widest font-semibold">
                        &copy; 2026 Tabacaria SaaS
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;