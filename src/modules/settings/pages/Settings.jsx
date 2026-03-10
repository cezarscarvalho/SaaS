import React, { useState, useEffect } from 'react';
import { supabase } from "../../../lib/supabase";
import {
    Building2, Save, Hash, MapPin,
    Loader2, CheckCircle, AlertCircle, Trash2, X
} from 'lucide-react';

const applyMask = (value) => {
    const cleanValue = value.replace(/\D/g, "").slice(0, 14);
    if (cleanValue.length <= 11) {
        return cleanValue.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
        return cleanValue.replace(/(\d{2})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1/$2").replace(/(\d{4})(\d{1,2})$/, "$1-$2");
    }
};

const Settings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [company, setCompany] = useState({
        id: '', nome_fantasia: '', cnpj: '', endereco: '', telefone: ''
    });

    useEffect(() => {
        fetchCompanyData();
    }, []);

    const fetchCompanyData = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('empresas').select('*').limit(1).single();
        if (!error && data) setCompany(data);
        setLoading(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        const { error } = await supabase
            .from('empresas')
            .update({
                nome_fantasia: company.nome_fantasia,
                cnpj: company.cnpj,
                endereco: company.endereco,
                telefone: company.telefone
            })
            .eq('id', company.id);

        if (!error) {
            setMessage({ type: 'success', text: 'Dados atualizados com sucesso!' });
            setTimeout(() => setMessage(null), 3000);
        } else {
            setMessage({ type: 'error', text: 'Erro ao atualizar dados.' });
        }
        setSaving(false);
    };

    const handleDeleteCompany = async () => {
        setSaving(true);
        const { error } = await supabase.from('empresas').delete().eq('id', company.id);

        if (!error) {
            window.location.reload(); // Recarrega para limpar o estado ou redirecionar
        } else {
            alert("Erro ao excluir: " + error.message);
            setSaving(false);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 p-4 pb-20">
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Configurações da Unidade</h1>
                <p className="text-gray-500 font-medium italic">Gerencie o cadastro e a visibilidade da sua tabacaria.</p>
            </div>

            <form onSubmit={handleSave} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 space-y-8 relative overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Building2 size={14} /> Nome Fantasia</label>
                        <input required className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={company.nome_fantasia} onChange={(e) => setCompany({ ...company, nome_fantasia: e.target.value })} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Hash size={14} /> CPF / CNPJ</label>
                        <input className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={company.cnpj} onChange={(e) => setCompany({ ...company, cnpj: applyMask(e.target.value) })} />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><MapPin size={14} /> Endereço Comercial</label>
                    <input className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={company.endereco || ''} onChange={(e) => setCompany({ ...company, endereco: e.target.value })} />
                </div>

                {message && (
                    <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in zoom-in ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        <span className="font-bold text-sm">{message.text}</span>
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-gray-50">
                    <button type="submit" disabled={saving} className="flex-1 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-indigo-100">
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} ATUALIZAR DADOS
                    </button>

                    <button type="button" onClick={() => setShowDeleteConfirm(true)} className="px-8 py-4 bg-white text-red-500 border border-red-100 rounded-2xl font-black hover:bg-red-50 transition-all active:scale-95 flex items-center justify-center gap-3">
                        <Trash2 size={20} /> EXCLUIR UNIDADE
                    </button>
                </div>
            </form>

            {/* MODAL DE CONFIRMAÇÃO DE DELETE */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full space-y-6 shadow-2xl animate-in zoom-in duration-300">
                        <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center text-red-500 mx-auto">
                            <AlertCircle size={32} />
                        </div>
                        <div className="text-center space-y-2">
                            <h2 className="text-xl font-black text-gray-900">TEM CERTEZA?</h2>
                            <p className="text-gray-500 text-sm font-medium">Esta ação é irreversível e apagará todos os dados vinculados a esta empresa.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => setShowDeleteConfirm(false)} className="py-4 bg-gray-100 text-gray-600 rounded-2xl font-black text-xs hover:bg-gray-200 transition-all">CANCELAR</button>
                            <button onClick={handleDeleteCompany} className="py-4 bg-red-500 text-white rounded-2xl font-black text-xs hover:bg-red-600 transition-all shadow-lg shadow-red-100">EXCLUIR</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;