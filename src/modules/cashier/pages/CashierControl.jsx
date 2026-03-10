import React, { useState, useEffect } from 'react';
import { supabase } from "../../../lib/supabase";
import {
    Wallet, Play, StopCircle, Calculator,
    DollarSign, Landmark, QrCode, CreditCard,
    AlertCircle, CheckCircle2, Loader2
} from 'lucide-react';

const CashierControl = () => {
    const [cashier, setCashier] = useState(null); // Estado do caixa atual
    const [loading, setLoading] = useState(true);
    const [openingValue, setOpeningValue] = useState('');
    const [summary, setSummary] = useState({ Pix: 0, Dinheiro: 0, Cartão: 0, total: 0 });

    useEffect(() => {
        checkCashierStatus();
    }, []);

    const checkCashierStatus = async () => {
        setLoading(true);
        // Busca o último caixa aberto (sem data de fechamento)
        const { data, error } = await supabase
            .from('cashier_sessions')
            .select('*')
            .is('closed_at', null)
            .single();

        if (data) {
            setCashier(data);
            fetchSalesSummary(data.opened_at);
        }
        setLoading(false);
    };

    const fetchSalesSummary = async (since) => {
        const { data } = await supabase
            .from('sales')
            .select('total_value, payment_method')
            .gte('created_at', since);

        const totals = data.reduce((acc, sale) => {
            acc[sale.payment_method] = (acc[sale.payment_method] || 0) + Number(sale.total_value);
            acc.total += Number(sale.total_value);
            return acc;
        }, { Pix: 0, Dinheiro: 0, Cartão: 0, total: 0 });

        setSummary(totals);
    };

    const handleOpenCashier = async () => {
        const { data, error } = await supabase
            .from('cashier_sessions')
            .insert([{
                opening_balance: Number(openingValue),
                opened_at: new Date().toISOString()
            }])
            .select().single();

        if (!error) setCashier(data);
    };

    if (loading) return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <header>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">CONTROLE DE CAIXA</h1>
                <p className="text-gray-500 font-medium">Gestão de abertura, fechamento e balanço diário.</p>
            </header>

            {!cashier ? (
                // TELA DE ABERTURA
                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 text-center space-y-6">
                    <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center text-green-600 mx-auto">
                        <Play size={40} />
                    </div>
                    <div className="max-w-xs mx-auto space-y-4">
                        <h2 className="text-xl font-black">Abrir Novo Caixa</h2>
                        <input
                            type="number"
                            placeholder="Valor inicial (Fundo de Troco)"
                            className="w-full p-4 bg-gray-50 rounded-2xl border-none font-bold text-center focus:ring-2 focus:ring-green-500"
                            value={openingValue}
                            onChange={(e) => setOpeningValue(e.target.value)}
                        />
                        <button
                            onClick={handleOpenCashier}
                            className="w-full py-4 bg-green-600 text-white rounded-2xl font-black shadow-lg hover:bg-green-700 transition-all"
                        >
                            INICIAR EXPEDIENTE
                        </button>
                    </div>
                </div>
            ) : (
                // TELA DE CAIXA ABERTO / BALANÇO
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <StatCard icon={<Landmark />} label="Pix / QR Code" value={summary.Pix} color="text-indigo-600" />
                            <StatCard icon={<DollarSign />} label="Dinheiro" value={summary.Dinheiro} color="text-green-600" />
                            <StatCard icon={<CreditCard />} label="Maquininha" value={summary.Cartão} color="text-blue-600" />
                            <StatCard icon={<Calculator />} label="Total em Vendas" value={summary.total} color="text-gray-900" />
                        </div>
                    </div>

                    <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white space-y-6 shadow-xl">
                        <div className="flex justify-between items-start">
                            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Caixa Aberto</span>
                            <span className="text-gray-400 text-xs font-bold">{new Date(cashier.opened_at).toLocaleTimeString()}</span>
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs font-black uppercase">Saldo em Caixa (Dinheiro)</p>
                            <p className="text-4xl font-black">R$ {(Number(cashier.opening_balance) + summary.Dinheiro).toFixed(2)}</p>
                        </div>
                        <button className="w-full py-4 bg-white/10 hover:bg-red-500 hover:text-white rounded-2xl font-black transition-all flex items-center justify-center gap-2">
                            <StopCircle size={20} /> FECHAR CAIXA
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-2">
        <div className={`${color} bg-gray-50 w-10 h-10 rounded-xl flex items-center justify-center`}>{icon}</div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
        <p className={`text-xl font-black ${color}`}>R$ {Number(value).toFixed(2)}</p>
    </div>
);

export default CashierControl;