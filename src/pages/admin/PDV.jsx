import React, { useState, useEffect } from 'react';
import { useCompany } from "@/context/CompanyContext";
import { getProducts } from "@/modules/products/services/productService";
import { registrarVenda } from "@/modules/sales/services/salesService";
import { ShoppingCart, Zap, CheckCircle, AlertCircle } from 'lucide-react';

const PDV = () => {
    const { companyId, session } = useCompany();
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [quantidade, setQuantidade] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (companyId) getProducts(companyId).then(setProducts);
    }, [companyId]);

    const produtoSelecionado = products.find(p => p.id === selectedProductId);
    const total = produtoSelecionado ? produtoSelecionado.preco * quantidade : 0;

    const handleVenda = async (e) => {
        e.preventDefault();
        if (!produtoSelecionado || quantidade > produtoSelecionado.estoque_atual) {
            alert("Estoque insuficiente ou produto não selecionado!");
            return;
        }

        setLoading(true);
        try {
            await registrarVenda({
                company_id: companyId,
                produto_id: selectedProductId,
                quantidade: parseInt(quantidade),
                valor_total: total,
                vendedor_id: session?.user?.id
            });

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            setQuantidade(1);
            setSelectedProductId('');
            // Atualiza a lista para refletir o novo estoque
            getProducts(companyId).then(setProducts);
        } catch (error) {
            alert("Erro na venda: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Zap className="text-yellow-500" /> Frente de Caixa (PDV)
                    </h1>
                    <p className="text-gray-500">Venda rápida e baixa automática no estoque.</p>
                </div>
            </header>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                {/* Lado Esquerdo: Formulário */}
                <form onSubmit={handleVenda} className="p-8 flex-1 space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Selecionar Produto</label>
                        <select
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={selectedProductId}
                            onChange={(e) => setSelectedProductId(e.target.value)}
                            required
                        >
                            <option value="">Clique para buscar...</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id} disabled={p.estoque_atual <= 0}>
                                    {p.nome} - R$ {p.preco.toFixed(2)} ({p.estoque_atual} em estoque)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Quantidade</label>
                            <input
                                type="number" min="1"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                                value={quantidade}
                                onChange={(e) => setQuantidade(e.target.value)}
                            />
                        </div>
                        <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 flex flex-col justify-center">
                            <span className="text-xs text-indigo-600 font-bold uppercase">Total</span>
                            <span className="text-xl font-black text-indigo-900">R$ {total.toFixed(2)}</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !selectedProductId}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? "Processando..." : <><ShoppingCart size={20} /> Finalizar Venda (Dinheiro/PIX)</>}
                    </button>

                    {success && (
                        <div className="flex items-center gap-2 text-green-600 font-medium justify-center animate-bounce">
                            <CheckCircle size={20} /> Venda realizada com sucesso!
                        </div>
                    )}
                </form>

                {/* Lado Direito: Resumo Rápido */}
                <div className="bg-gray-50 p-8 md:w-72 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col justify-center">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Resumo do Item</h3>
                    {produtoSelecionado ? (
                        <div className="space-y-2">
                            <p className="text-lg font-bold text-gray-800">{produtoSelecionado.nome}</p>
                            <p className="text-sm text-gray-500">Unitário: R$ {produtoSelecionado.preco.toFixed(2)}</p>
                            <div className="pt-4 border-t border-gray-200">
                                <p className="text-xs text-gray-400">Estoque após venda:</p>
                                <p className="text-sm font-bold text-gray-700">{produtoSelecionado.estoque_atual - quantidade} unidades</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 italic">Nenhum produto selecionado para a venda.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PDV;