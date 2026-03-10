import React, { useState, useEffect } from 'react';
import { supabase } from "../../../lib/supabase";
import {
    History, Search, Calendar, Filter,
    ChevronRight, Printer, RotateCcw, Loader2,
    CheckCircle, AlertTriangle
} from 'lucide-react';

const SalesHistory = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSale, setSelectedSale] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        setLoading(true);
        // Busca simples sem o nome do produto primeiro para testar a conexão
        const { data, error } = await supabase
            .from('sales')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Erro no Supabase:", error.message);
        } else {
            setSales(data || []);
        }
        setLoading(false);
    };

    const handleOpenDetails = (sale) => {
        setSelectedSale(sale);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Histórico de Movimentação</h1>
                    <p className="text-gray-500 font-medium italic text-sm">Consulte e gerencie todas as transações realizadas.</p>
                </div>
            </div>

            {/* FILTROS RÁPIDOS */}
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="Buscar por ID ou Valor..." className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-none font-bold text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <button className="px-6 py-3 bg-gray-50 rounded-xl font-bold text-gray-500 flex items-center gap-2 hover:bg-gray-100 transition-all text-sm">
                    <Calendar size={18} /> Hoje
                </button>
            </div>

            {/* LISTA DE VENDAS */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Data/Hora</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Itens</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Pagamento</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Valor Total</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {sales.map((sale) => (
                                <tr key={sale.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-900 text-sm">{new Date(sale.created_at).toLocaleDateString('pt-BR')}</p>
                                        <p className="text-[10px] text-gray-400 font-bold">{new Date(sale.created_at).toLocaleTimeString('pt-BR')}</p>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg font-black text-[10px]">
                                            {sale.sales_items?.length || 0} PROD
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${sale.payment_method === 'Pix' ? 'bg-indigo-100 text-indigo-600' : 'bg-green-100 text-green-600'}`}>
                                            {sale.payment_method}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-black text-gray-900 text-sm">
                                        R$ {Number(sale.total_value).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleOpenDetails(sale)} className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                                            <ChevronRight size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* MODAL DE DETALHES DA VENDA */}
            {isModalOpen && selectedSale && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-8 bg-gray-900 text-white flex justify-between items-start">
                            <div>
                                <p className="text-indigo-400 font-black text-[10px] uppercase tracking-widest">Detalhes da Transação</p>
                                <h2 className="text-xl font-black mt-1">VENDA #{selectedSale.id.split('-')[0].toUpperCase()}</h2>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all"><Printer size={20} /></button>
                        </div>

                        <div className="p-8 overflow-y-auto flex-1 space-y-6">
                            <div className="space-y-4">
                                {selectedSale.sales_items?.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center border-b border-gray-50 pb-4">
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">{item.products?.name || 'Produto Excluído'}</p>
                                            <p className="text-xs text-gray-400 font-medium">{item.quantity}un x R$ {Number(item.unit_price).toFixed(2)}</p>
                                        </div>
                                        <p className="font-black text-gray-900">R$ {(item.quantity * item.unit_price).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-gray-50 p-6 rounded-2xl space-y-2">
                                <div className="flex justify-between text-xs font-bold text-gray-400">
                                    <span>Subtotal</span>
                                    <span>R$ {Number(selectedSale.total_value).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-black text-gray-900 pt-2 border-t">
                                    <span>Total Final</span>
                                    <span className="text-indigo-600">R$ {Number(selectedSale.total_value).toFixed(2)}</span>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-red-50 text-red-500 rounded-2xl font-black text-xs hover:bg-red-100 transition-all flex items-center justify-center gap-2">
                                <RotateCcw size={16} /> ESTORNAR VENDA (DEVOLVER AO ESTOQUE)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesHistory;