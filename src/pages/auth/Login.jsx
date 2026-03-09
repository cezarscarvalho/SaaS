import React, { useState } from 'react';
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { LogIn, Lock, Mail, AlertCircle } from 'lucide-react';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
                : err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
                <div>
                    <div className="mx-auto h-12 w-12 bg-indigo-100 flex items-center justify-center rounded-full text-indigo-600">
                        <LogIn size={28} />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        SaaS Tabacaria
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Entre na sua conta para gerenciar sua loja
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 flex items-center gap-3 text-red-700 text-sm">
                            <AlertCircle size={18} />
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="relative mb-4">
                            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">E-mail</label>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-5">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                required
                                className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="relative">
                            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Senha</label>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-5">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                required
                                className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors`}
                        >
                            {loading ? "Verificando..." : "Entrar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;