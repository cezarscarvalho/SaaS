import React, { useState, useEffect } from 'react';
import { supabase } from "../../../lib/supabase";
import {
    Package, Plus, Search, Trash2, Edit3,
    Loader2, Image as ImageIcon, Upload, X
} from 'lucide-react';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [uploading, setUploading] = useState(false);

    const [newProduct, setNewProduct] = useState({
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

    // FUNÇÃO DE UPLOAD PARA O STORAGE
    const handleUploadImage = async (e) => {
        try {
            setUploading(true);
            const file = e.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload do arquivo
            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Pegar a URL Pública
            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            setNewProduct({ ...newProduct, image_url: publicUrl });
        } catch (error) {
            alert('Erro no upload: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.from('products').insert([{
            name: newProduct.name,
            price: parseFloat(newProduct.price),
            stock: parseInt(newProduct.stock),
            category: newProduct.category,
            image_url: newProduct.image_url
        }]);

        if (!error) {
            setNewProduct({ name: '', price: '', stock: '', category: 'Tabaco', image_url: '' });
            setIsModalOpen(false);
            fetchProducts();
        }
        setLoading(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Gestão de Estoque</h1>
                    <p className="text-gray-500 font-medium italic text-sm">Organize seu catálogo com imagens reais.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-95">
                    <Plus size={20} /> NOVO PRODUTO
                </button>
            </div>

            {/* TABELA COM IMAGENS */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Produto</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Preço</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Estoque</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                                                {p.image_url ? <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" /> : <ImageIcon className="text-gray-300" size={20} />}
                                            </div>
                                            <span className="font-bold text-gray-900">{p.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-black text-indigo-600">R$ {Number(p.price).toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${p.stock < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                            {p.stock} UN
                                        </span>
                                    </td>
                                    <td className="px-6 py-4"><button className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL COM UPLOAD */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl space-y-6">
                        <div className="flex justify-between items-center border-b pb-4">
                            <h2 className="text-xl font-black text-gray-900">NOVO ITEM</h2>
                            <button onClick={() => setIsModalOpen(false)}><X className="text-gray-400 hover:text-gray-900" size={24} /></button>
                        </div>

                        <form onSubmit={handleAddProduct} className="space-y-4">
                            {/* UPLOAD BOX */}
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-4 hover:border-indigo-400 transition-colors bg-gray-50 group">
                                {newProduct.image_url ? (
                                    <div className="relative h-24 w-24">
                                        <img src={newProduct.image_url} className="h-full w-full object-cover rounded-xl" alt="Preview" />
                                        <button type="button" onClick={() => setNewProduct({ ...newProduct, image_url: '' })} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={12} /></button>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer flex flex-col items-center">
                                        {uploading ? <Loader2 className="animate-spin text-indigo-600" /> : <Upload className="text-gray-400 group-hover:text-indigo-600" />}
                                        <span className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">Upload da Foto</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleUploadImage} disabled={uploading} />
                                    </label>
                                )}
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Nome do Produto</label>
                                <input required className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-indigo-500 font-bold" placeholder="Nome" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Preço</label>
                                    <input required type="number" step="0.01" className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 font-bold" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Estoque</label>
                                    <input required type="number" className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 font-bold" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} />
                                </div>
                            </div>

                            <button type="submit" disabled={loading || uploading} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black shadow-lg hover:bg-indigo-700 active:scale-95 transition-all">
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