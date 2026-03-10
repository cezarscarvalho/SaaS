import React, { useState } from 'react';
import { supabase } from "../../../lib/supabase"; // Ajustado para caminho relativo padrão
import { useNavigate } from "react-router-dom";
import { LogIn, Lock, Mail, AlertCircle, Eye, EyeOff, Send } from 'lucide-react';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [resetSent, setResetSent] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            // Sucesso: Redireciona para o Dashboard administrativo
            navigate("/admin");
        } catch (err) {
            setError("E-mail ou senha incorretos. Verifique suas credenciais.");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setError("Digite seu e-mail para receber o link de recuperação.");
            return;
        }
        setLoading(true);
        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            if (resetError) throw resetError;
            setResetSent(true);
            setError(null);
        } catch (err) {
            setError("Erro ao processar recuperação. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
                <div className="text-center">
                    <div className="mx-auto h-14 w-14 bg-indigo-100 flex items-center justify-center rounded-2xl text-indigo-600 shadow-inner">
                        <LogIn size={32} />
                    </div>
                    <h2 className="mt-6 text-3xl font-black text-gray-900 tracking-tight">SaaS Tabacaria</h2>
                    <p className="mt-2 text-sm text-gray-500 font-medium">Acesse sua gestão digital</p>
                </div>

                {resetSent ? (
                    <div className="bg-green-50 p-8 rounded-2xl text-center space-y-4 border border-green-100 animate-in fade-in zoom-in duration-300">
                        <Send className="mx-auto text-green-500" size={40} />
                        <p className="text-green-800 font-bold">Link enviado!</p>
                        <p className="text-green-700 text-sm">Se o e-mail estiver cadastrado, você receberá instruções em instantes.</p>
                        <button
                            onClick={() => setResetSent(false)}
                            className="text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline"
                        >
                            Voltar ao Login
                        </button>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-center gap-3 text-red-700 text-sm rounded-r-lg animate-pulse">
                                <AlertCircle size={18} className="shrink-0" />
                                <p className="font-bold">{error}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* Campo E-mail */}
                            <div className="relative">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">E-mail</label>
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none mt-6">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email" required
                                    className="appearance-none rounded-xl block w-full px-12 py-4 border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="admin@tabacaria.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            {/* Campo Senha */}
                            <div className="relative">
                                <div className="flex justify-between items-end mb-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Senha</label>
                                    <button
                                        type="button"
                                        onClick={handleForgotPassword}
                                        className="text-[10px] font-black text-indigo-600 hover:text-indigo-500 uppercase tracking-tighter"
                                    >
                                        Esqueceu a senha?
                                    </button>
                                </div>
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none mt-6">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"} required
                                    className="appearance-none rounded-xl block w-full px-12 py-4 border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center mt-6 text-gray-400 hover:text-indigo-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-4 border border-transparent text-sm font-black rounded-xl text-white shadow-xl transition-all ${loading ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-indigo-100'
                                }`}
                        >
                            {loading ? "VERIFICANDO..." : "ENTRAR NO SISTEMA"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;