import React, { useState, useEffect } from 'react';
import { supabase } from "../../../lib/supabase";
import {
    Package,
    Plus,
    Search,
    Trash2,
    Edit3,
    AlertCircle,
    Loader2
} from 'lucide-react';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Estados para o novo produto
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        stock: '',
        category: 'Tabaco'
    });

    // BUSCAR PRODUTOS
    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) setProducts(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // CADASTRAR PRODUTO
    const handleAddProduct = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase
            .from('products')
            .insert([{
                name: newProduct.name,
                price: parseFloat(newProduct.price),
                stock: parseInt(newProduct.stock),
                category: newProduct.category
            }]);

        if (!error) {
            setNewProduct({ name: '', price: '', stock: '', category: 'Tabaco' });
            setIsModalOpen(false);
            fetchProducts();
        } else {
            alert("Erro ao cadastrar: Verifique se a tabela 'products' existe no Supabase.");
        }
        setLoading(false);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Gestão de Estoque</h1>
                    <p className="text-gray-500 font-medium">Cadastre e monitore seus produtos.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-95"
                >
                    <Plus size={20} /> NOVO PRODUTO
                </button>
            </div>

            {/* BUSCA E FILTROS */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Buscar produto pelo nome..."
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* TABELA DE PRODUTOS */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-20 flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-indigo-600" size={40} />
                        <p className="text-gray-400 font-bold">Carregando estoque...</p>
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Produto</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Categoria</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Preço</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Estoque</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredProducts.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-900">{p.name}</td>
                                        <td className="px-6 py-4 text-gray-500 font-medium">{p.category}</td>
                                        <td className="px-6 py-4 font-black text-indigo-600">R$ {p.price.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-black ${p.stock < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                {p.stock} UN
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 flex gap-2">
                                            <button className="p-2 text-gray-400 hover:text-indigo-600"><Edit3 size={18} /></button>
                                            <button className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-20 text-center flex flex-col items-center gap-4">
                        <Package size={60} className="text-gray-200" />
                        <p className="text-gray-400 font-medium text-lg">Nenhum produto encontrado.</p>
                    </div>
                )}
            </div>

            {/* MODAL DE CADASTRO */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-black text-gray-900 uppercase">Novo Item</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold">FECHAR</button>
                        </div>

                        <form onSubmit={handleAddProduct} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Nome do Produto</label>
                                <input required
                                    className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                                    placeholder="Ex: Essência Zomo Mint"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Preço de Venda</label>
                                    <input required type="number" step="0.01"
                                        className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                                        placeholder="0.00"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Qtd em Estoque</label>
                                    <input required type="number"
                                        className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                                        placeholder="0"
                                        value={newProduct.stock}
                                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
                            >
                                {loading ? "SALVANDO..." : "CONFIRMAR CADASTRO"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;