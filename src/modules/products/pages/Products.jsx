import React, { useState, useEffect } from 'react';
import { supabase } from "../../../lib/supabase";
import {
    Package, Plus, Search, Trash2, Edit3,
    Loader2, Image as ImageIcon, Upload, X, Check
} from 'lucide-react';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [uploading, setUploading] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        stock: '',
        category: 'Tabaco',
        image_url: ''
    });

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });
        if (!error) setProducts(data);
        setLoading(false);
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product.id);
            setFormData({
                name: product.name,
                price: product.price,
                stock: product.stock,
                category: product.category || 'Tabaco',
                image_url: product.image_url || ''
            });
        } else {
            setEditingProduct(null);
            setFormData({ name: '', price: '', stock: '', category: 'Tabaco', image_url: '' });
        }
        setIsModalOpen(true);
    };

    const handleUploadImage = async (e) => {
        try {
            setUploading(true);
            const file = e.target.files[0];
            if (!file) return;
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, file);
            if (uploadError) throw uploadError;
            const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
            setFormData({ ...formData, image_url: publicUrl });
        } catch (error) {
            alert('Erro no upload: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            name: formData.name,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            category: formData.category,
            image_url: formData.image_url
        };

        let error;
        if (editingProduct) {
            const { error: updateError } = await supabase.from('products').update(payload).eq('id', editingProduct);
            error = updateError;
        } else {
            const { error: insertError } = await supabase.from('products').insert([payload]);
            error = insertError;
        }

        if (!error) {
            setIsModalOpen(false);
            fetchProducts();
        } else {
            alert("Erro ao salvar produto.");
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este produto?")) {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (!error) fetchProducts();
        }
    };

    // Filtro de busca
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Estoque Central</h1>
                    <p className="text-gray-500 font-medium italic text-sm">Gerencie preços e quantidades em tempo real.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-95">
                    <Plus size={20} /> ADICIONAR ITEM
                </button>
            </div>

            {/* BARRA DE BUSCA */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Buscar produto pelo nome..."
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* LISTAGEM */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Item</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Preço</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Estoque</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredProducts.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                                            {p.image_url ? <img src={p.image_url} className="h-full w-full object-cover" alt={p.name} /> : <ImageIcon className="text-gray-300" size={16} />}
                                        </div>
                                        <span className="font-bold text-gray-900 truncate max-w-[150px]">{p.name}</span>
                                    </td>
                                    <td className="px-6 py-4 font-black text-indigo-600">R$ {Number(p.price).toFixed(2)}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black ${p.stock < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                            {p.stock} UN
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => handleOpenModal(p)} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"><Edit3 size={18} /></button>
                                        <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL UNIFICADO */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl space-y-6">
                        <div className="flex justify-between items-center border-b pb-4">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)}><X className="text-gray-400 hover:text-gray-900" size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Box de Imagem */}
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-4 bg-gray-50 hover:border-indigo-400 transition-colors">
                                {formData.image_url ? (
                                    <div className="relative h-20 w-20">
                                        <img src={formData.image_url} className="h-full w-full object-cover rounded-xl" alt="Preview" />
                                        <button type="button" onClick={() => setFormData({ ...formData, image_url: '' })} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={12} /></button>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer flex flex-col items-center">
                                        {uploading ? <Loader2 className="animate-spin text-indigo-600" /> : <Upload className="text-gray-400" />}
                                        <span className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest text-center">Adicionar Foto</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleUploadImage} disabled={uploading} />
                                    </label>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Nome Comercial</label>
                                    <input required className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 font-bold outline-none focus:ring-2 focus:ring-indigo-500" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Preço de Venda</label>
                                        <input required type="number" step="0.01" className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 font-bold outline-none focus:ring-2 focus:ring-indigo-500" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Estoque</label>
                                        <input required type="number" className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 font-bold outline-none focus:ring-2 focus:ring-indigo-500" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" disabled={loading || uploading} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2">
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                                {editingProduct ? "SALVAR ALTERAÇÕES" : "CADASTRAR PRODUTO"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;