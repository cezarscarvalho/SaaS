import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';  // Importação crucial para navegação
import { useCompany } from "@/context/CompanyContext";
import { getDashboardMetrics } from "../services/dashboardService";
import { Package, AlertTriangle, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';

const Dashboard = () => {
    const { companyId, loadingCompany } = useCompany();
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (companyId) {
            getDashboardMetrics(companyId).then(data => {
                setMetrics(data);
                setLoading(false);
            });
        }
    }, [companyId]);

    if (loadingCompany || loading) {
        return <div className="p-8 text-gray-500 font-medium">Carregando painel de controle...</div>;
    }

    // Adicionamos o 'path' para onde cada card deve levar
    const cards = [
        { title: "Produtos Ativos", value: metrics?.totalProdutos, icon: <Package />, color: "bg-blue-500", path: "/admin/products" },
        { title: "Estoque Crítico", value: metrics?.estoqueBaixo, icon: <AlertTriangle />, color: "bg-red-500", path: "/admin/products" },
        { title: "Vendas (PDV)", value: "Abrir Caixa", icon: <DollarSign />, color: "bg-green-500", path: "/admin/PDV" }, // AJUSTADO AQUI
        { title: "Performance", value: "100%", icon: <TrendingUp />, color: "bg-purple-500", path: "/admin" },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Painel de Gestão</h1>
                    <p className="text-gray-500 mt-1">Visão geral da sua tabacaria em tempo real.</p>
                </div>
                <div className="hidden md:block text-sm text-gray-400 font-medium">
                    ID Empresa: <span className="text-gray-600">{companyId.split('-')[0]}...</span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                    <Link
                        key={index}
                        to={card.path}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md hover:border-indigo-200 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl text-white ${card.color} shadow-lg shadow-gray-100`}>
                                {card.icon}
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">{card.title}</p>
                                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs font-bold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            GERENCIAR <ArrowRight size={14} className="ml-1" />
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-indigo-600 p-8 rounded-3xl text-white relative overflow-hidden shadow-xl shadow-indigo-100">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-2">Pronto para vender?</h2>
                        <p className="text-indigo-100 mb-6 max-w-xs">Acesse o PDV agora para realizar vendas e atualizar seu estoque automaticamente.</p>
                        <Link to="/admin/PDV" className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors inline-block">
                            Ir para o Frente de Caixa
                        </Link>
                    </div>
                    <DollarSign className="absolute -right-4 -bottom-4 w-32 h-32 text-indigo-500 opacity-50" />
                </div>

                <div className="bg-white p-8 rounded-3xl border border-dashed border-gray-300 flex flex-col justify-center items-center text-center">
                    <div className="bg-gray-50 p-4 rounded-full mb-4">
                        <TrendingUp className="text-gray-400" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg">Novas métricas em breve</h3>
                    <p className="text-gray-400 text-sm max-w-xs">Estamos preparando relatórios de faturamento mensal e ticket médio.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;