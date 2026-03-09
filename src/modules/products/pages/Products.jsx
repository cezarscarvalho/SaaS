import React, { useState } from 'react';
import { supabase } from "@/lib/supabase"; // Caminho validado pela sua árvore
import { Package, Save, AlertCircle } from 'lucide-react';

const Product = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        categoria: '',
        preco: '',
        estoque_atual: '',
        sku: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Identifica o lojista logado (Essencial para o RLS)
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) throw new Error("Sessão expirada. Faça login novamente.");

            // 2. Prepara o objeto para o banco blindado
            const productToSave = {
                nome: formData.nome,
                descricao: formData.descricao,
                categoria: formData.categoria,
                preco: parseFloat(formData.preco.replace(',', '.')), // Converte para decimal
                estoque_atual: parseInt(formData.estoque_atual),
                sku: formData.sku,
                company_id: user.id // O UUID do lojista que garante a blindagem
            };

            // 3. Insere no Supabase
            const { error } = await supabase
                .from('produtos')
                .insert([productToSave]);

            if (error) throw error;

            alert("✅ Produto cadastrado com sucesso!");

            // Limpa o formulário após o sucesso
            setFormData({
                nome: '',
                descricao: '',
                categoria: '',
                preco: '',
                estoque_atual: '',
                sku: ''
            });

        } catch (error) {
            console.error("Erro no cadastro:", error.message);
            alert("❌ Erro ao salvar: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6 border-b pb-4">
                <Package className="text-indigo-600" size={28} />
                <h1 className="text-2xl font-bold text-gray-800">Novo Produto - SaaS</h1>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100">

                {/* Nome do Produto */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Item (Tabacaria ou Geral)</label>
                    <input
                        required
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        placeholder="Ex: Charuto Cohiba Behike / Isqueiro Zippo"
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>

                {/* Preço e Estoque */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço de Venda (R$)</label>
                    <input
                        required
                        type="text"
                        name="preco"
                        value={formData.preco}
                        onChange={handleChange}
                        placeholder="0,00"
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estoque Inicial</label>
                    <input
                        required
                        type="number"
                        name="estoque_atual"
                        value={formData.estoque_atual}
                        onChange={handleChange}
                        placeholder="Qtd em unidades"
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>

                {/* Categoria e SKU */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                    <select
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    >
                        <option value="">Selecione...</option>
                        <option value="tabaco">Tabacos/Charutos</option>
                        <option value="acessorios">Acessórios</option>
                        <option value="bebidas">Bebidas</option>
                        <option value="outros">Outros</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Código/SKU</label>
                    <input
                        name="sku"
                        value={formData.sku}
                        onChange={handleChange}
                        placeholder="Opcional"
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>

                {/* Botão de Ação */}
                <div className="md:col-span-2 mt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'
                            }`}
                    >
                        {loading ? 'Processando...' : <><Save size={20} /> Salvar Produto</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Product;