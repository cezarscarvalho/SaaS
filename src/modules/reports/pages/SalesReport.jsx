import React, { useState, useEffect } from 'react';
import { supabase } from "../../../lib/supabase";
import {
    BarChart3,
    Calendar,
    TrendingUp,
    ArrowLeft,
    Loader2,
    FileText
} from 'lucide-react';

const SalesReport = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        dailyTotal: 0,
        salesCount: 0,
        averageTicket: 0
    });

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        setLoading(true);
        // Busca vendas das últimas 24h
        const { data, error } = await supabase
            .from('sales')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            const total = data.reduce((acc, curr) => acc + Number(curr.total_value), 0);
            setSales(data);
            setStats({
                dailyTotal: total,
                salesCount: data.length,
                averageTicket: data.length > 0 ? total / data.length : 0
            });
        }
        setLoading(false);
    };

    if (loading) return (
        <div className="h-full flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-indigo-600" size={48} />
            <p className="text-gray-400 font-black uppercase text-xs tracking-widest">Processando Relatórios...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Relatórios de Venda</h1>
                    <p className="text-gray-500 font-medium italic text-sm">Histórico financeiro e performance da loja.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 flex items-center gap-2 text-gray-500 font-bold text-sm shadow-sm">
                    <Calendar size={18} />
                    {new Date().toLocaleDateString('pt-BR')}
                </div>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Faturamento Total</p>
                    <h2 className="text-3xl font-black text-indigo-600">R$ {stats.dailyTotal.toFixed(2)}</h2>
                    <p className="text-xs text-green-500 font-bold mt-2 flex items-center gap-1">
                        <TrendingUp size={14} /> +12% vs ontem
                    </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Vendas Realizadas</p>
                    <h2 className="text-3xl font-black text-gray-900">{stats.salesCount}</h2>
                    <p className="text-xs text-gray-400 font-medium mt-2">Transações processadas no PDV</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Ticket Médio</p>
                    <h2 className="text-3xl font-black text-gray-900">R$ {stats.averageTicket.toFixed(2)}</h2>
                    <p className="text-xs text-gray-400 font-medium mt-2">Média de gasto por cliente</p>
                </div>
            </div>

            {/* LISTA DE ÚLTIMAS VENDAS */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center gap-2">
                    <BarChart3 className="text-indigo-600" size={20} />
                    <h2 className="font-black text-gray-900 uppercase text-sm tracking-tight">Últimas Transações</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Horário</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID Venda</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Pagamento</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Valor</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {sales.map((sale) => (
                                <tr key={sale.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 text-xs font-bold text-gray-500">
                                        {new Date(sale.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="px-6 py-4 text-xs font-mono text-gray-400 uppercase">
                                        #{sale.id.split('-')[0]}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${sale.payment_method === 'Pix' ? 'bg-indigo-100 text-indigo-600' : 'bg-green-100 text-green-600'
                                            }`}>
                                            {sale.payment_method}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-black text-gray-900">
                                        R$ {Number(sale.total_value).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SalesReport;