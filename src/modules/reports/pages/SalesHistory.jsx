import React, { useState, useEffect } from 'react';
import { supabase } from "../../../lib/supabase";
import {
    Search, Calendar, ChevronRight,
    RotateCcw, Loader2, X, BarChart3
} from 'lucide-react';

const SalesHistory = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSale, setSelectedSale] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchSales = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('sales')
                .select('*, sales_items(*, products(name))')
                .order('created_at', { ascending: false });

            if (!error) setSales(data || []);
            setLoading(false);
        };
        fetchSales();
    }, []);

    const handleCancelSale = async (vendaId) => {
        if (!window.confirm("Deseja realmente cancelar esta venda? O estoque será estornado.")) return;

        setActionLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { error } = await supabase
                .from('sales')
                .update({
                    status: 'cancelada',
                    cancelado_por: user?.id,
                    motivo_cancelamento: 'Estorno administrativo'
                })
                .eq('id', vendaId);

            if (!error) {
                alert("Venda cancelada!");
                setIsModalOpen(false);
                window.location.reload(); // Recarga limpa para o estado do build
            }
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 p-4">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Histórico</h1>
                    <p className="text-gray-500 font-medium text-sm">Auditoria e estornos de estoque.</p>
                </div>
                <BarChart3 className="text-indigo-600" size={32} />
            </header>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Data</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Total</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Ação</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm">
                        {sales.map((sale) => (
                            <tr key={sale.id} className={sale.status === 'cancelada' ? 'opacity-40 grayscale' : ''}>
                                <td className="px-6 py-4 font-bold text-gray-700">
                                    {new Date(sale.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${sale.status === 'cancelada' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                        {sale.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-black">R$ {Number(sale.total_value).toFixed(2)}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => { setSelectedSale(sale); setIsModalOpen(true); }} className="p-2 hover:text-indigo-600 transition-all">
                                        <ChevronRight size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && selectedSale && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
                        <div className="p-6 bg-gray-900 text-white flex justify-between items-center">
                            <h2 className="text-lg font-black uppercase">Venda #{selectedSale.id?.substring(0, 8)}</h2>
                            <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="space-y-3">
                                {selectedSale.sales_items?.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm border-b border-gray-50 pb-2">
                                        <span className="font-bold">{item.products?.name}</span>
                                        <span className="font-black">R$ {Number(item.unit_price).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            {selectedSale.status !== 'cancelada' && (
                                <button
                                    onClick={() => handleCancelSale(selectedSale.id)}
                                    disabled={actionLoading}
                                    className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-black text-xs hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2"
                                >
                                    {actionLoading ? <Loader2 className="animate-spin" size={16} /> : <RotateCcw size={16} />}
                                    CANCELAR E ESTORNAR ESTOQUE
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesHistory;