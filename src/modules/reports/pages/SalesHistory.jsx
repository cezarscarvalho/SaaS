import React, { useState, useEffect } from 'react';
import { supabase } from "../../../lib/supabase";
import { Search, ChevronRight, RotateCcw, Loader2, X } from 'lucide-react';

const SalesHistory = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSale, setSelectedSale] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchSales = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('sales')
            .select('*, sales_items(*, products(name))')
            .order('created_at', { ascending: false });
        setSales(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchSales();
    }, []);

    const handleCancel = async (id) => {
        if (!window.confirm("Confirmar cancelamento e estorno?")) return;
        setActionLoading(true);

        const { data: userData } = await supabase.auth.getUser();
        const { error } = await supabase
            .from('sales')
            .update({
                status: 'cancelada',
                cancelado_por: userData?.user?.id
            })
            .eq('id', id);

        if (!error) {
            setIsModalOpen(false);
            fetchSales();
        }
        setActionLoading(false);
    };

    if (loading) return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="p-4 max-w-6xl mx-auto space-y-6">
            <h1 className="text-2xl font-black uppercase tracking-tighter">Histórico</h1>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-black uppercase text-[10px] text-gray-400">Data</th>
                            <th className="p-4 font-black uppercase text-[10px] text-gray-400 text-center">Status</th>
                            <th className="p-4 font-black uppercase text-[10px] text-gray-400 text-right">Total</th>
                            <th className="p-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.map((s) => (
                            <tr key={s.id} className={s.status === 'cancelada' ? 'opacity-40 grayscale' : ''}>
                                <td className="p-4 font-bold">{new Date(s.created_at).toLocaleDateString()}</td>
                                <td className="p-4 text-center">
                                    <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${s.status === 'cancelada' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                        {s.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right font-black">R$ {Number(s.total_value).toFixed(2)}</td>
                                <td className="p-4 text-right">
                                    <button onClick={() => { setSelectedSale(s); setIsModalOpen(true); }} className="p-2 hover:bg-gray-100 rounded-lg">
                                        <ChevronRight size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && selectedSale && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-[2rem] p-6 space-y-6 animate-in zoom-in duration-200">
                        <div className="flex justify-between items-center">
                            <h2 className="font-black uppercase">Detalhes</h2>
                            <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
                        </div>

                        <div className="space-y-2">
                            {selectedSale.sales_items?.map((item, i) => (
                                <div key={i} className="flex justify-between text-sm border-b pb-2">
                                    <span className="font-medium">{item.products?.name}</span>
                                    <span className="font-bold">R$ {Number(item.unit_price).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        {selectedSale.status !== 'cancelada' && (
                            <button
                                onClick={() => handleCancel(selectedSale.id)}
                                disabled={actionLoading}
                                className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-black text-xs hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                {actionLoading ? <Loader2 className="animate-spin" size={16} /> : <RotateCcw size={16} />}
                                CANCELAR E ESTORNAR
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesHistory;