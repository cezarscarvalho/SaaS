import React, { useState, useEffect } from 'react';
import { supabase } from "../../../lib/supabase";
import {
    Building2, Save, Hash, MapPin,
    Loader2, CheckCircle, AlertCircle
} from 'lucide-react';

// FUNÇÃO DE MÁSCARA (FORA DO COMPONENTE PARA EVITAR ERROS DE SCOPE)
const applyMask = (value) => {
    const cleanValue = value.replace(/\D/g, "").slice(0, 14);

    if (cleanValue.length <= 11) {
        return cleanValue
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
        return cleanValue
            .replace(/(\d{2})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1/$2")
            .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
    }
};

const Settings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    const [company, setCompany] = useState({
        nome_fantasia: '',
        cnpj: '',
        endereco: '',
        telefone: ''
    });

    useEffect(() => {
        const fetchCompanyData = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('empresas').select('*').limit(1).single();
            if (!error && data) setCompany(data);
            setLoading(false);
        };
        fetchCompanyData();
    }, []);

    const handleDocChange = (e) => {
        const maskedValue = applyMask(e.target.value);
        setCompany(prev => ({ ...prev, cnpj: maskedValue }));
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
            setMessage({ type: 'success', text: 'Configurações salvas!' });
            setTimeout(() => setMessage(null), 3000);
        } else {
            setMessage({ type: 'error', text: 'Erro ao salvar.' });
        }
        setSaving(false);
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 p-4">
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Configurações</h1>
                <p className="text-gray-500 font-medium">Dados da sua Tabacaria Pro.</p>
            </div>

            <form onSubmit={handleSave} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Building2 size={14} /> Empresa</label>
                        <input required className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold focus:ring-2 focus:ring-indigo-500 outline-none" value={company.nome_fantasia} onChange={(e) => setCompany({ ...company, nome_fantasia: e.target.value })} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Hash size={14} /> CPF / CNPJ</label>
                        <input className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Digite apenas números" value={company.cnpj} onChange={handleDocChange} />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><MapPin size={14} /> Endereço</label>
                    <input className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold focus:ring-2 focus:ring-indigo-500 outline-none" value={company.endereco || ''} onChange={(e) => setCompany({ ...company, endereco: e.target.value })} />
                </div>

                {message && (
                    <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in zoom-in ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        <span className="font-bold text-sm">{message.text}</span>
                    </div>
                )}

                <button type="submit" disabled={saving} className="w-full md:w-auto px-12 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-indigo-600 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50">
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} SALVAR
                </button>
            </form>
        </div>
    );
};

export default Settings;