import React, { useState, useEffect } from 'react';
import { useCompany } from "@/context/CompanyContext";
import { createProduct, getProducts } from "../services/productService";
import { Plus, Package, DollarSign, List } from 'lucide-react';

const Products = () => {
    const { companyId } = useCompany();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ nome: '', preco: '', estoque_atual: '' });

    // Carregar produtos ao abrir a tela
    const loadProducts = async () => {
        if (companyId) {
            const data = await getProducts(companyId);
            setProducts(data);
        }
    };

    useEffect(() => { loadProducts(); }, [companyId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createProduct({
                ...formData,
                company_id: companyId,
                preco: parseFloat(formData.preco),
                estoque_atual: parseInt(formData.estoque_atual)
            });
            setFormData({ nome: '', preco: '', estoque_atual: '' }); // Limpa o formulário
            loadProducts(); // Atualiza a lista
            alert("Produto cadastrado com sucesso!");
        } catch (error) {
            alert("Erro ao cadastrar: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Package className="text-indigo-600" /> Gestão de Estoque
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulário de Cadastro */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Plus size={18} /> Novo Produto
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nome do Item</label>
                            <input
                                type="text" required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                                value={formData.nome}
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Preço (R$)</label>
                                <input
                                    type="number" step="0.01" required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                                    value={formData.preco}
                                    onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Estoque Inicial</label>
                                <input
                                    type="number" required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                                    value={formData.estoque_atual}
                                    onChange={(e) => setFormData({ ...formData, estoque_atual: e.target.value })}
                                />
                            </div>
                        </div>
                        <button
                            type="submit" disabled={loading}
                            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors font-medium"
                        >
                            {loading ? "Salvando..." : "Cadastrar Produto"}
                        </button>
                    </form>
                </div>

                {/* Lista de Produtos */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center gap-2 font-semibold">
                        <List size={18} /> Itens em Estoque
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estoque</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{product.nome}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">R$ {product.preco.toFixed(2)}</td>
                                    <td className={`px-6 py-4 text-sm font-bold ${product.estoque_atual < 5 ? 'text-red-500' : 'text-green-600'}`}>
                                        {product.estoque_atual} un
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Products;