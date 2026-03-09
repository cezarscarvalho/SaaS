import React, { useEffect, useState } from 'react';
import { useCompany } from "@/context/CompanyContext";
import { getDashboardMetrics } from "../services/dashboardService";
import { Package, AlertTriangle, DollarSign, TrendingUp } from 'lucide-react';

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
        return <div className="p-8 text-gray-500">Carregando painel de controle...</div>;
    }

    const cards = [
        { title: "Produtos Ativos", value: metrics?.totalProdutos, icon: <Package />, color: "bg-blue-500" },
        { title: "Estoque Crítico", value: metrics?.estoqueBaixo, icon: <AlertTriangle />, color: "bg-red-500" },
        { title: "Vendas (Hoje)", value: "R$ 0,00", icon: <DollarSign />, color: "bg-green-500" },
        { title: "Performance", value: "0%", icon: <TrendingUp />, color: "bg-purple-500" },
    ];

    return (
        <div className="p-6">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Painel de Gestão</h1>
                <p className="text-gray-500 text-sm">Bem-vindo à sua tabacaria digital.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className={`p-3 rounded-lg text-white ${card.color}`}>
                            {card.icon}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{card.title}</p>
                            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-indigo-50 border border-indigo-100 p-6 rounded-xl">
                <h2 className="text-indigo-800 font-semibold mb-2 text-lg">Próximos Passos do SaaS</h2>
                <ul className="text-indigo-600 text-sm space-y-2 list-disc ml-4">
                    <li>Cadastrar os primeiros produtos para ver o contador subir.</li>
                    <li>Configurar a tabela de **Vendas** no Supabase.</li>
                    <li>Implementar o PDV (Frente de Caixa) para movimentar o estoque.</li>
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;