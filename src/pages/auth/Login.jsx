import React, { useState } from 'react';
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { LogIn, Lock, Mail, AlertCircle, Eye, EyeOff, Send } from 'lucide-react';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [resetSent, setResetSent] = useState(false); // Estado para confirmação de envio
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
            if (authError) throw authError;
            navigate("/admin");
        } catch (err) {
            setError("E-mail ou senha incorretos.");
        } finally {
            setLoading(false);
        }
    };

    // FUNÇÃO MATADORA: Recuperação de Senha
    const handleForgotPassword = async () => {
        if (!email) {
            setError("Por favor, digite seu e-mail primeiro.");
            return;
        }
        setLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            if (error) throw error;

            // Feedback de segurança: sempre dizemos que enviamos, 
            // para não confirmar se o e-mail existe ou não na base.
            setResetSent(true);
            setError(null);
        } catch (err) {
            setError("Erro ao processar solicitação.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
                <div>
                    <div className="mx-auto h-14 w-14 bg-indigo-100 flex items-center justify-center rounded-2xl text-indigo-600">
                        <LogIn size={32} />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-black text-gray-900 tracking-tight">SaaS Tabacaria</h2>
                </div>

                {resetSent ? (
                    <div className="bg-green-50 p-6 rounded-2xl text-center space-y-4">
                        <Send className="mx-auto text-green-500" size={40} />
                        <p className="text-green-800 font-medium">
                            Se este e-mail estiver cadastrado, você receberá um link de recuperação em instantes.
                        </p>
                        <button onClick={() => setResetSent(false)} className="text-indigo-600 font-bold text-sm">Voltar para o login</button>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-center gap-3 text-red-700 text-sm rounded-r-lg">
                                <AlertCircle size={18} />
                                <p className="font-medium">{error}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="relative">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">E-mail</label>
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none mt-5">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email" required
                                    className="appearance-none rounded-xl block w-full px-12 py-4 border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="exemplo@tabacaria.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="relative">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Senha</label>
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none mt-5">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"} required
                                    className="appearance-none rounded-xl block w-full px-12 py-4 border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="Sua senha secreta"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center mt-5 text-gray-400 hover:text-indigo-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                className="text-sm font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
                            >
                                Esqueceu a senha?
                            </button>
                        </div>

                        <button
                            type="submit" disabled={loading}
                            className={`w-full flex justify-center py-4 border border-transparent text-sm font-black rounded-xl text-white shadow-lg transition-all ${loading ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
                                }`}
                        >
                            {loading ? "PROCESSANDO..." : "ENTRAR NO SISTEMA"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;