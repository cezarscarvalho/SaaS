import React, { useState, useEffect } from 'react';
import { supabase } from "../../lib/supabase";
import {
    Search, ShoppingCart, Trash2, Plus, Minus,
    CheckCircle, Image as ImageIcon, Loader2, Wallet, Zap
} from 'lucide-react';

const PDV = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async () => {
        const { data } = await supabase.from('products').select('*').gt('stock', 0).order('name');
        setProducts(data || []);
    };

    const addToCart = (product) => {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const updateQuantity = (id, delta) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : item;
            }
            return item;
        }));
    };

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleFinishSale = async (method) => {
        if (cart.length === 0) return;
        setLoading(true);
        try {
            const { data: sale, error: saleError } = await supabase.from('sales').insert([{ total_value: total, payment_method: method }]).select().single();
            if (saleError) throw saleError;
            const itemsToInsert = cart.map(item => ({ sale_id: sale.id, product_id: item.id, quantity: item.quantity, unit_price: item.price }));
            const { error: itemsError } = await supabase.from('sales_items').insert(itemsToInsert);
            if (itemsError) throw itemsError;
            setSuccess(true);
            setCart([]);
            fetchProducts();
            setTimeout(() => setSuccess(false), 2500);
        } catch (error) {
            alert("Erro: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] gap-4 animate-in fade-in duration-500 overflow-hidden">

            {/* SEÇÃO DE PRODUTOS */}
            <div className="flex-1 flex flex-col min-w-0 bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-50 bg-gray-50/30 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text" placeholder="O que vamos vender agora?"
                            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm transition-all"
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="hidden md:flex items-center gap-2 bg-indigo-50 px-3 py-2 rounded-xl text-indigo-600 font-black text-[10px] uppercase tracking-tighter">
                        <Zap size={14} fill="currentColor" /> Modo Turbo ON
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 content-start">
                    {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
                        <button key={p.id} onClick={() => addToCart(p)} className="bg-white p-2 rounded-2xl border border-gray-100 hover:border-indigo-500 hover:shadow-md transition-all text-left flex flex-col group active:scale-95">
                            <div className="aspect-square w-full rounded-xl bg-gray-50 mb-2 overflow-hidden">
                                {p.image_url ? (
                                    <img src={p.image_url} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-gray-200"><ImageIcon size={24} /></div>
                                )}
                            </div>
                            <h3 className="font-bold text-gray-700 text-[11px] leading-tight line-clamp-2 h-8">{p.name}</h3>
                            <div className="mt-1 flex justify-between items-center">
                                <span className="text-indigo-600 font-black text-xs">R$ {Number(p.price).toFixed(2)}</span>
                                <span className="text-[9px] font-black text-gray-300">EST: {p.stock}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* CARRINHO LATERAL */}
            <div className="w-full lg:w-[400px] bg-gray-900 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden text-white">
                <div className="p-6 flex justify-between items-center bg-gray-800/50 border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <ShoppingCart className="text-indigo-400" size={20} />
                        <span className="font-black text-sm uppercase tracking-widest">Pedido Atual</span>
                    </div>
                    <span className="bg-indigo-500 text-white text-[10px] px-2 py-1 rounded-full font-black">{cart.length} ITENS</span>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-3">
                    {success ? (
                        <div className="h-full flex flex-col items-center justify-center text-center animate-bounce">
                            <CheckCircle className="text-green-400 mb-2" size={48} />
                            <p className="font-black text-lg">VENDA CONCLUÍDA!</p>
                        </div>
                    ) : cart.length > 0 ? (
                        cart.map(item => (
                            <div key={item.id} className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5 animate-in slide-in-from-right-4">
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-xs truncate">{item.name}</p>
                                    <p className="text-indigo-400 font-black text-[10px]">R$ {(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-800 rounded-xl p-1">
                                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-white text-gray-500"><Minus size={14} /></button>
                                    <span className="font-black text-xs w-4 text-center">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-white text-gray-500"><Plus size={14} /></button>
                                </div>
                                <button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="text-gray-600 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                            </div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-600 border-2 border-dashed border-gray-800 rounded-3xl">
                            <ShoppingCart size={32} className="mb-2 opacity-20" />
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-20">Aguardando itens...</p>
                        </div>
                    )}
                </div>

                {/* FOOTER DO CARRINHO */}
                <div className="p-6 bg-gray-800/80 backdrop-blur-md">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Total a Pagar</span>
                        <span className="text-4xl font-black text-white tracking-tighter">R$ {total.toFixed(2)}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            disabled={cart.length === 0 || loading} onClick={() => handleFinishSale('Dinheiro')}
                            className="flex flex-col items-center justify-center gap-1 bg-white text-gray-900 py-4 rounded-2xl font-black text-[10px] hover:bg-green-400 transition-all active:scale-95 disabled:opacity-20"
                        >
                            <Wallet size={18} /> DINHEIRO
                        </button>
                        <button
                            disabled={cart.length === 0 || loading} onClick={() => handleFinishSale('Pix')}
                            className="flex flex-col items-center justify-center gap-1 bg-indigo-500 text-white py-4 rounded-2xl font-black text-[10px] hover:bg-indigo-400 transition-all active:scale-95 disabled:opacity-20 shadow-lg shadow-indigo-500/20"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <><Zap size={18} fill="currentColor" /> PIX / CARTÃO</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PDV;