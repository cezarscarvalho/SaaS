import { useEffect, useState } from "react";
import { getDashboardMetrics } from "../services/dashboardService";
import { useCompany } from "../../../context/CompanyContext";
import { DollarSign, Package, ShoppingBag } from "lucide-react";

export default function Dashboard() {
    const { company } = useCompany();
    const [metrics, setMetrics] = useState({ totalSalesToday: 0, lowStockCount: 0, totalOrdersToday: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            if (!company) return;
            try {
                const data = await getDashboardMetrics(company.id);
                setMetrics(data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        }
        load();
    }, [company]);

    return (
        <div className="p-6 text-white">
            <h1 className="text-3xl font-bold mb-8">Dashboard: {company?.name}</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Card 1: Vendas do Dia */}
                <div className="bg-slate-800 p-6 rounded-2xl border border-emerald-500/20 shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500"><DollarSign /></div>
                        <p className="text-slate-400 font-medium">Vendas Hoje</p>
                    </div>
                    <p className="text-3xl font-bold mt-4">R$ {metrics.totalSalesToday.toFixed(2)}</p>
                </div>

                {/* Card 2: Estoque Baixo */}
                <div className="bg-slate-800 p-6 rounded-2xl border border-red-500/20 shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-500/10 rounded-lg text-red-500"><Package /></div>
                        <p className="text-slate-400 font-medium">Alertas de Estoque</p>
                    </div>
                    <p className="text-3xl font-bold mt-4">{metrics.lowStockCount} <span className="text-sm font-normal text-slate-500">itens críticos</span></p>
                </div>

                {/* Card 3: Volume de Pedidos */}
                <div className="bg-slate-800 p-6 rounded-2xl border border-blue-500/20 shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400"><ShoppingBag /></div>
                        <p className="text-slate-400 font-medium">Pedidos Hoje</p>
                    </div>
                    <p className="text-3xl font-bold mt-4">{metrics.totalOrdersToday}</p>
                </div>

            </div>
        </div>
    );
}