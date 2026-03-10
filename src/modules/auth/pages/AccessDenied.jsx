import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';

const AccessDenied = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl p-10 text-center space-y-6 border border-gray-100">
                <div className="relative flex justify-center">
                    <div className="bg-red-50 p-6 rounded-full text-red-500 animate-pulse">
                        <Lock size={64} strokeWidth={2.5} />
                    </div>
                    <div className="absolute -top-2 -right-2">
                        <ShieldAlert className="text-red-600" size={32} />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tighter">ACESSO RESTRITO</h1>
                    <p className="text-gray-500 font-medium leading-relaxed">
                        Ops! Parece que você tentou entrar em uma área reservada apenas para administradores.
                    </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Protocolo de Segurança</p>
                    <p className="text-xs font-bold text-gray-600 mt-1 italic">Nível de acesso insuficiente para este módulo.</p>
                </div>

                <Link
                    to="/admin/pdv"
                    className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100"
                >
                    <ArrowLeft size={20} /> VOLTAR PARA AS VENDAS
                </Link>
            </div>
        </div>
    );
};

export default AccessDenied;