import React, { useState } from 'react';
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { LogIn, Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Estado para o olhinho
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            // Se logou com sucesso, vai para o dashboard
            navigate("/admin");
        } catch (err) {
            setError(err.message === "Invalid login credentials"
                ? "E-mail ou senha incorretos."
                : "Erro ao acessar o sistema. Verifique sua conexão.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
                <div>
                    <div className="mx-auto h-14 w-14 bg-indigo-100 flex items-center justify-center rounded-2xl text-indigo-600 shadow-inner">
                        <LogIn size={32} />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-black text-gray-900 tracking-tight">
                        SaaS Tabacaria
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-500 font-medium">
                        Painel Administrativo
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-center gap-3 text-red-700 text-sm rounded-r-lg">
                            <AlertCircle size={18} className="shrink-0" />
                            <p className="font-medium">{error}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Campo de E-mail */}
                        <div className="relative">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">E-mail</label>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none mt-5">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                required
                                className="appearance-none rounded-xl relative block w-full px-12 py-4 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm bg-gray-50 transition-all"
                                placeholder="exemplo@tabacaria.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Campo de Senha com Olhinho */}
                        <div className="relative">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Senha</label>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none mt-5">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className="appearance-none rounded-xl relative block w-full px-12 py-4 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm bg-gray-50 transition-all"
                                placeholder="Sua senha secreta"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            {/* Botão para alternar visibilidade */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center mt-5 text-gray-400 hover:text-indigo-600 transition-colors focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-xl text-white shadow-lg transition-all ${loading
                                    ? 'bg-indigo-300 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-95'
                                }`}
                        >
                            {loading ? "AUTENTICANDO..." : "ENTRAR NO SISTEMA"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;