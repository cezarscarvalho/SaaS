import React, { useState, useEffect } from 'react';
import { supabase } from "../../../lib/supabase";
import {
    DollarSign,
    Package,
    AlertTriangle,
    TrendingUp,
    ArrowUpRight,
    Loader2
} from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalItems: 0,
        inventoryValue: 0,
        lowStockCount: 0,
        topCategory: 'Tabaco'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('products').select('*');

            if (!error && data) {
                const totalValue = data.reduce((acc, curr) => acc + (curr.price * curr.stock), 0);
                const lowStock = data.filter(p => p.stock < 5).length;

                setStats({
                    totalItems: data.length,
                    inventoryValue: totalValue,
                    lowStockCount: lowStock,
                    topCategory: 'Tabaco' // Futuramente podemos calcular a categoria com mais itens
                });
            }
            setLoading(false);
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-indigo-600" size={48} />
                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Sincronizando Dados...</p>
            </div>
        );
    }

    const cards = [
        {
            label: "Patrimônio em Estoque",
            value: `R$ ${stats.inventoryValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            icon: <DollarSign size={24} />,
            color: "text-green-600",
            bg: "bg-green-100",
            description: "Valor total investido em produtos"
        },
        {
            label: "Itens Cadastrados",
            value: stats.totalItems,
            icon: <Package size={24} />,
            color: "text-indigo-600",
            bg: "bg-indigo-100",
            description: "Total de variedades no catálogo"
        },
        {
            label: "Alerta de Ruptura",
            value: stats.lowStockCount,
            icon: <AlertTriangle size={24} />,
            color: "text-red-600",
            bg: "bg-red-100",
            description: "Produtos com menos de 5 unidades"
        }
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Visão Geral</h1>
                <p className="text-gray-500 font-medium">Bem-vindo ao centro de comando da sua tabacaria.</p>
            </div>

            {/* GRID DE CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card, index) => (
                    <div key={index} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50/50 transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`${card.bg} ${card.color} p-4 rounded-2xl shadow-inner`}>
                                {card.icon}
                            </div>
                            <div className="bg-gray-50 p-2 rounded-full text-gray-400 group-hover:text-indigo-600 transition-colors">
                                <ArrowUpRight size={18} />
                            </div>
                        </div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{card.label}</p>
                        <h3 className="text-3xl font-black text-gray-900 mb-2">{card.value}</h3>
                        <p className="text-sm text-gray-500 font-medium">{card.description}</p>
                    </div>
                ))}
            </div>

            {/* SEÇÃO DE ATALHOS RÁPIDOS */}
            <div className="bg-indigo-900 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-indigo-200">
                <div className="space-y-2 text-center md:text-left">
                    <h2 className="text-2xl font-black flex items-center gap-3 justify-center md:justify-start">
                        <TrendingUp className="text-yellow-400" /> Pronto para vender?
                    </h2>
                    <p className="text-indigo-200 font-medium">Abra o PDV e comece a faturar agora mesmo.</p>
                </div>
                <button
                    onClick={() => window.location.href = '/admin/pdv'}
                    className="bg-white text-indigo-900 px-10 py-5 rounded-2xl font-black text-lg hover:bg-yellow-400 hover:text-indigo-950 transition-all shadow-lg active:scale-95"
                >
                    ABRIR FRENTE DE CAIXA
                </button>
            </div>
        </div>
    );
};

export default Dashboard;