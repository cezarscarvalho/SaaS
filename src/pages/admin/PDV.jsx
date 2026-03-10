import React, { useState, useEffect } from 'react';
import { supabase } from "../../lib/supabase";
import {
    Search,
    ShoppingCart,
    Trash2,
    Plus,
    Minus,
    CheckCircle,
    Image as ImageIcon,
    Loader2
} from 'lucide-react';

const PDV = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const { data } = await supabase
            .from('products')
            .select('*')
            .gt('stock', 0) // Só mostra o que tem em estoque
            .order('name');
        setProducts(data || []);
    };

    const addToCart = (product) => {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            setCart(cart.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
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
            // 1. Registra a Venda
            const { data: sale, error: saleError } = await supabase
                .from('sales')
                .insert([{ total_value: total, payment_method: method }])
                .select()
                .single();

            if (saleError) throw saleError;

            // 2. Registra os Itens da Venda
            const itemsToInsert = cart.map(item => ({
                sale_id: sale.id,
                product_id: item.id,
                quantity: item.quantity,
                unit_price: item.price
            }));

            const { error: itemsError } = await supabase
                .from('sales_items')
                .insert(itemsToInsert);

            if (itemsError) throw itemsError;

            // 3. Sucesso!
            setSuccess(true);
            setCart([]);
            fetchProducts(); // Atualiza a lista com o novo estoque
            setTimeout(() => setSuccess(false), 3000);

        } catch (error) {
            alert("Erro ao finalizar venda: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-120px)] gap-6 animate-in fade-in duration-500">

            {/* LADO ESQUERDO: LISTA DE PRODUTOS */}
            <div className="flex-1 space-y-4 flex flex-col min-h-0">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar produto para venda..."
                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pr-2">
                    {filteredProducts.map(p => (
                        <button
                            key={p.id}
                            onClick={() => addToCart(p)}
                            className="bg-white p-3 rounded-2xl border border-gray-100 hover:border-indigo-500 hover:shadow-lg transition-all text-left group flex flex-col h-full"
                        >
                            <div className="aspect-square w-full rounded-xl bg-gray-50 mb-3 overflow-hidden flex items-center justify-center">
                                {p.image_url ? (
                                    <img src={p.image_url} className="h-full w-full object-cover group-hover:scale-110 transition-transform" />
                                ) : (
                                    <ImageIcon className="text-gray-200" size={32} />
                                )}
                            </div>
                            <h3 className="font-bold text-gray-800 text-sm line-clamp-2 flex-1">{p.name}</h3>
                            <p className="text-indigo-600 font-black mt-2">R$ {Number(p.price).toFixed(2)}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Estoque: {p.stock}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* LADO DIREITO: CARRINHO */}
            <div className="w-full lg:w-96 bg-white rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center gap-2">
                    <ShoppingCart className="text-indigo-600" size={24} />
                    <h2 className="font-black text-xl text-gray-900 tracking-tight">CARRINHO</h2>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {success ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in">
                            <CheckCircle className="text-green-500" size={64} />
                            <p className="font-black text-green-800 text-xl">VENDA REALIZADA!</p>
                            <p className="text-gray-500 text-sm">O estoque foi baixado automaticamente.</p>
                        </div>
                    ) : cart.length > 0 ? (
                        cart.map(item => (
                            <div key={item.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl">
                                <div className="flex-1">
                                    <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                                    <p className="text-indigo-600 font-black text-xs">R$ {(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                                <div className="flex items-center gap-2 bg-white rounded-lg border p-1">
                                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-indigo-600"><Minus size={14} /></button>
                                    <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-indigo-600"><Plus size={14} /></button>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={18} /></button>
                            </div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center opacity-20">
                            <ShoppingCart size={48} />
                            <p className="font-bold mt-2">Carrinho Vazio</p>
                        </div>
                    )}
                </div>

                <div className="p-8 bg-gray-50 space-y-4">
                    <div className="flex justify-between items-end">
                        <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Total da Venda</span>
                        <span className="text-3xl font-black text-gray-900">R$ {total.toFixed(2)}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button
                            disabled={cart.length === 0 || loading}
                            onClick={() => handleFinishSale('Dinheiro')}
                            className="bg-green-600 text-white py-4 rounded-xl font-black text-xs hover:bg-green-700 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin mx-auto" size={16} /> : "DINHEIRO"}
                        </button>
                        <button
                            disabled={cart.length === 0 || loading}
                            onClick={() => handleFinishSale('Pix')}
                            className="bg-indigo-600 text-white py-4 rounded-xl font-black text-xs hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin mx-auto" size={16} /> : "PIX / CARTÃO"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PDV;