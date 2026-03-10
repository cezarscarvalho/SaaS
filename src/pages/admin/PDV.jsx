import React, { useState, useEffect } from 'react';
import { useCompany } from "../../context/CompanyContext"; // Ajuste o caminho se necessário
import { getProducts } from "../../modules/products/services/productService";
import { registrarVenda } from "../../modules/sales/services/salesService";
import { ShoppingCart, Zap, CheckCircle, Package } from 'lucide-react';

const PDV = () => {
    const { companyId, session, loadingCompany } = useCompany();
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [quantidade, setQuantidade] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (companyId) {
            getProducts(companyId).then(setProducts).catch(console.error);
        }
    }, [companyId]);

    // Se o contexto ainda estiver carregando, mostra um aviso
    if (loadingCompany) return <div className="p-10 text-center">Carregando dados da empresa...</div>;

    const produtoSelecionado = products.find(p => p.id === selectedProductId);
    const total = produtoSelecionado ? produtoSelecionado.preco * quantidade : 0;

    const handleVenda = async (e) => {
        e.preventDefault();
        if (!produtoSelecionado || quantidade > (produtoSelecionado.estoque_atual || 0)) {
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
            getProducts(companyId).then(setProducts); // Atualiza estoque na tela
        } catch (error) {
            alert("Erro na venda: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                    <Zap className="text-yellow-500 fill-yellow-500" /> PDV Tabacaria
                </h1>
                <p className="text-gray-500 font-medium">Frente de caixa rápido e eficiente.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col lg:flex-row">
                {/* Lado Esquerdo - Operação */}
                <form onSubmit={handleVenda} className="p-10 flex-1 space-y-8">
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Produto</label>
                        <select
                            className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all text-lg font-medium"
                            value={selectedProductId}
                            onChange={(e) => setSelectedProductId(e.target.value)}
                            required
                        >
                            <option value="">Selecione o item...</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id} disabled={(p.estoque_atual || 0) <= 0}>
                                    {p.nome} - R$ {Number(p.preco).toFixed(2)} ({p.estoque_atual || 0} em estoque)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Qtd.</label>
                            <input
                                type="number" min="1"
                                className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none text-xl font-bold"
                                value={quantidade}
                                onChange={(e) => setQuantidade(e.target.value)}
                            />
                        </div>
                        <div className="bg-indigo-600 p-4 rounded-2xl flex flex-col justify-center items-center text-white shadow-lg shadow-indigo-200">
                            <span className="text-xs font-bold opacity-80 uppercase">Total a Pagar</span>
                            <span className="text-2xl font-black">R$ {total.toFixed(2)}</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !selectedProductId}
                        className={`w-full py-5 rounded-2xl text-white font-black text-lg shadow-xl transition-all flex items-center justify-center gap-3 ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
                            }`}
                    >
                        {loading ? "PROCESSANDO..." : <><ShoppingCart /> FINALIZAR VENDA</>}
                    </button>

                    {success && (
                        <div className="p-4 bg-green-50 rounded-xl flex items-center justify-center gap-2 text-green-600 font-bold animate-bounce">
                            <CheckCircle /> VENDA REALIZADA COM SUCESSO!
                        </div>
                    )}
                </form>

                {/* Lado Direito - Detalhes */}
                <div className="bg-gray-50 p-10 lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-100 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 text-center lg:text-left">Resumo</h3>
                        {produtoSelecionado ? (
                            <div className="space-y-6">
                                <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-200">
                                    <Package className="text-indigo-500 mb-2" size={24} />
                                    <p className="text-sm font-bold text-gray-800 leading-tight">{produtoSelecionado.nome}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-400 font-bold uppercase">Preço Unitário</p>
                                    <p className="text-lg font-bold text-gray-700">R$ {Number(produtoSelecionado.preco).toFixed(2)}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic text-center lg:text-left mt-20">Aguardando seleção de produto...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PDV;