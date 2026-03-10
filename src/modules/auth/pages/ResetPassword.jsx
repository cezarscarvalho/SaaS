import React, { useState } from 'react';
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    // LÓGICA DE FORÇA DA SENHA
    const getPasswordStrength = (pwd) => {
        let strength = 0;
        if (pwd.length >= 6) strength++;
        if (/[A-Z]/.test(pwd) || /[!@#$%^&*]/.test(pwd)) strength++;
        if (/[0-9]/.test(pwd)) strength++;
        return strength;
    };

    const strength = getPasswordStrength(password);

    // Mapeamento de Cores e Labels
    const strengthData = [
        { label: "Muito Curta", color: "bg-gray-200", text: "text-gray-400" },
        { label: "Fraca", color: "bg-red-500", text: "text-red-500" },
        { label: "Média", color: "bg-yellow-500", text: "text-yellow-600" },
        { label: "Forte", color: "bg-green-500", text: "text-green-600" }
    ];

    const handleReset = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }
        if (password.length < 6) {
            setError("A senha deve ter no mínimo 6 caracteres.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // O Supabase utiliza o token da URL automaticamente para validar a sessão de reset
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
                    <div className="mx-auto h-14 w-14 bg-indigo-100 flex items-center justify-center rounded-2xl text-indigo-600 mb-4 shadow-inner">
                        <ShieldCheck size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Nova Senha</h2>
                    <p className="text-gray-500 mt-2 font-medium italic">Proteja sua Tabacaria Digital.</p>
                </div>

                {success ? (
                    <div className="bg-green-50 p-8 rounded-2xl text-center space-y-4 border border-green-100">
                        <CheckCircle className="mx-auto text-green-500" size={56} />
                        <p className="text-green-900 font-black text-xl">Senha Atualizada!</p>
                        <p className="text-green-700 text-sm">Redirecionando para o login em instantes...</p>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleReset}>
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-center gap-3 text-red-700 text-sm rounded-r-lg animate-shake">
                                <AlertCircle size={18} className="shrink-0" />
                                <p className="font-bold">{error}</p>
                            </div>
                        )}

                        <div className="space-y-6">
                            {/* Campo Nova Senha */}
                            <div className="relative">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Crie sua Senha</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="appearance-none rounded-xl block w-full px-4 py-4 border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                                        placeholder="Mínimo 6 caracteres"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-indigo-600"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                {/* RÉGUA INDICATIVA DE FORÇA */}
                                {password.length > 0 && (
                                    <div className="mt-3 px-1">
                                        <div className="flex gap-1.5 h-1.5 w-full">
                                            <div className={`flex-1 rounded-full transition-all duration-500 ${strength >= 1 ? strengthData[strength].color : 'bg-gray-100'}`}></div>
                                            <div className={`flex-1 rounded-full transition-all duration-500 ${strength >= 2 ? strengthData[strength].color : 'bg-gray-100'}`}></div>
                                            <div className={`flex-1 rounded-full transition-all duration-500 ${strength >= 3 ? strengthData[strength].color : 'bg-gray-100'}`}></div>
                                        </div>
                                        <p className={`text-[10px] font-black uppercase tracking-tighter mt-1 text-right ${strengthData[strength].text}`}>
                                            Força: {strengthData[strength].label}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Campo Confirmar Senha */}
                            <div className="relative">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Repita a Senha</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="appearance-none rounded-xl block w-full px-4 py-4 border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                                    placeholder="Confirme sua nova senha"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-5 border border-transparent text-sm font-black rounded-xl text-white shadow-xl shadow-indigo-100 transition-all ${loading
                                    ? 'bg-indigo-300 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
                                }`}
                        >
                            {loading ? "SALVANDO SEGURANÇA..." : "ATUALIZAR MINHA SENHA"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;