import React, { useState } from 'react';
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // O Supabase entende que o usuário está vindo do link de e-mail
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            setSuccess(true);
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setError("O link pode ter expirado. Tente solicitar a recuperação novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
                <div className="text-center">
                    <div className="mx-auto h-14 w-14 bg-indigo-100 flex items-center justify-center rounded-2xl text-indigo-600 mb-4">
                        <Lock size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900">Nova Senha</h2>
                    <p className="text-gray-500 mt-2 font-medium">Digite sua nova credencial de acesso.</p>
                </div>

                {success ? (
                    <div className="bg-green-50 p-6 rounded-2xl text-center space-y-4 animate-pulse">
                        <CheckCircle className="mx-auto text-green-500" size={48} />
                        <p className="text-green-800 font-bold text-lg">Senha alterada com sucesso!</p>
                        <p className="text-green-600 text-sm italic">Redirecionando para o login...</p>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleReset}>
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-center gap-3 text-red-700 text-sm rounded-r-lg">
                                <AlertCircle size={18} />
                                <p className="font-medium">{error}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="relative">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Nova Senha</label>
                                <input
                                    type={showPassword ? "text" : "password"} required
                                    className="appearance-none rounded-xl block w-full px-4 py-4 border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="Mínimo 6 caracteres"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center mt-5 text-gray-400"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            <div className="relative">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Confirmar Senha</label>
                                <input
                                    type={showPassword ? "text" : "password"} required
                                    className="appearance-none rounded-xl block w-full px-4 py-4 border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="Repita a nova senha"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit" disabled={loading}
                            className={`w-full flex justify-center py-4 border border-transparent text-sm font-black rounded-xl text-white shadow-lg transition-all ${loading ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
                                }`}
                        >
                            {loading ? "SALVANDO..." : "ATUALIZAR SENHA"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;