import React, { useState, useEffect } from 'react';
import { supabase } from "../../../lib/supabase";
import {
    History, Search, Calendar, ChevronRight,
    Printer, RotateCcw, Loader2, CheckCircle,
    AlertTriangle, X
} from 'lucide-react';

const SalesHistory = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSale, setSelectedSale] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('sales')
            .select('*, sales_items(*, products(name))')
            .order('created_at', { ascending: false });

        if (!error) setSales(data || []);
        setLoading(false);
    };

    const handleCancelSale = async (vendaId) => {
        if (!window.confirm("Deseja realmente cancelar esta venda? O estoque será estornado automaticamente.")) return;

        setActionLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        const { error } = await supabase
            .from('sales')
            .update({
                status: 'cancelada',
                cancelado_por: user.id,
                motivo_cancelamento: 'Solicitado pelo administrador'
            })
            .eq('id', vendaId);

        if (!error) {
            alert("Venda cancelada com sucesso! O estoque foi atualizado.");
            setIsModalOpen(false);
            fetchSales(); // Recarrega a lista
        } else {
            alert("Erro ao cancelar: " + error.message);
        }
        setActionLoading(false);
    };

    if (loading) return (
        <div className="h-full flex items-center justify-center p-20">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <header>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Histórico de Movimentação</h1>
                <p className="text-gray-500 font-medium italic text-sm">Gestão de vendas e auditoria de estornos.</p>
            </header>

            {/* TABELA DE VENDAS */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Data/Hora</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Pagamento</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Total</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Detalhes</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {sales.map((sale) => (
                            <tr key={sale.id} className={`hover:bg-gray-50/30 transition-colors ${sale.status === 'cancelada' ? 'opacity-50 grayscale' : ''}`}>
                                <td className="px-6 py-4">
                                    <p className="font-bold text-gray-900 text-sm">{new Date(sale.created_at).toLocaleDateString()}</p>
                                    <p className="text-[10px] text-gray-400 font-bold">{new Date(sale.created_at).toLocaleTimeString()}</p>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${sale.status === 'cancelada' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-