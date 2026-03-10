import React, { useEffect, useState } from 'react';
import { supabase } from "@/lib/supabase";
import { useCompany } from "@/context/CompanyContext";
import { Plus, Edit, Trash2, Package, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Products = () => {
    const { companyId } = useCompany();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (companyId) {
            fetchProducts();
        }
    }, [companyId]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('produtos')
                .select('*')
                .eq('company_id', companyId) // Filtro de segurança SaaS
                .order('nome', { ascending: true });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error("Erro ao carregar produtos:", error.message);
        } finally {
            setLoading(false);
        }
    };

    // Filtro de busca simples em memória
    const filteredProducts = products.filter(p =>
        p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            {/* Cabeçalho */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Meus Produtos</h1>
                    <p className="text-gray-500 text-sm">Gerencie o estoque da sua tabacaria</p>
                </div>

                <Link
                    to="/admin/products/new" // Verifique se esta rota existe ou aponte para seu form
                    className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all shadow-sm"
                >
                    <Plus size={20} /> Novo Produto
                </Link>
            </div>

            {/* Barra de Busca */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Buscar por nome ou SKU..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Tabela de Produtos */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-10 text-center text-gray-500">Carregando estoque...</div>
                ) : filteredProducts.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-4 font-semibold text-gray-600 text-sm">Produto</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm">Categoria</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm">Preço</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm text-center">Estoque</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-medium text-gray-800">{product.nome}</div>
                                            <div className="text-xs text-gray-400">{product.sku || 'Sem SKU'}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full capitalize">
                                                {product.categoria}
                                            </span>
                                        </td>
                                        <td className="p-4 font-medium text-gray-700">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco)}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`font-bold ${product.estoque_atual <= 5 ? 'text-red-500' : 'text-gray-700'}`}>
                                                {product.estoque_atual}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors">
                                                    <Edit size={18} />
                                                </button>
                                                <button className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-20 text-center">
                        <Package className="mx-auto text-gray-300 mb-4" size={48} />
                        <p className="text-gray-500">Nenhum produto encontrado.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;