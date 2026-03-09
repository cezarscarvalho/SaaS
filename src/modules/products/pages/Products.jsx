import { useEffect, useState } from "react";
import { getProducts, createProduct, uploadProductImage } from "../services/productService";
import { useCompany } from "../../../context/CompanyContext";
import { Plus, Package, Image as ImageIcon, Loader2 } from "lucide-react";

export default function Products() {
    const { company } = useCompany();

    // Estados para a Listagem
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    // Estados para o Formulário
    const [nome, setNome] = useState("");
    const [precoVenda, setPrecoVenda] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    // 1. Carregar produtos da empresa
    async function loadProducts() {
        if (!company) return;
        setLoading(true);
        try {
            const data = await getProducts(company.id);
            setProducts(data);
        } catch (err) {
            console.error("Erro ao carregar lista");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { loadProducts(); }, [company]);

    // 2. Gerar Preview da Foto
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // 3. Salvar Produto (Upload + Banco)
    async function handleAddProduct(e) {
        e.preventDefault();
        if (!nome || !precoVenda || !company) return;

        setIsUploading(true);
        let publicImageUrl = "";

        try {
            if (imageFile) {
                publicImageUrl = await uploadProductImage(imageFile, company.id);
            }

            const newProduct = {
                nome: nome,
                preco_venda: Number(precoVenda),
                company_id: company.id,
                foto_url: publicImageUrl,
                estoque_atual: 0
            };

            await createProduct(newProduct);

            // Resetar Form
            setNome("");
            setPrecoVenda("");
            setImageFile(null);
            setPreviewUrl("");
            loadProducts(); // Atualiza a lista automaticamente
            alert("Produto cadastrado!");
        } catch (error) {
            alert("Erro ao salvar.");
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <div className="p-6 text-white max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <Package className="text-blue-500" /> Estoque de Produtos
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* COLUNA 1: FORMULÁRIO DE CADASTRO */}
                <section className="bg-slate-800 p-6 rounded-2xl border border-slate-700 h-fit">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <Plus size={20} /> Novo Produto
                    </h2>

                    <form onSubmit={handleAddProduct} className="space-y-4">
                        {/* Campo de Imagem */}
                        <div className="flex flex-col items-center p-4 border-2 border-dashed border-slate-600 rounded-xl hover:border-blue-500 transition-colors cursor-pointer relative">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                            ) : (
                                <div className="flex flex-col items-center py-6 text-slate-500">
                                    <ImageIcon size={40} />
                                    <span className="text-xs mt-2">Clique para adicionar foto</span>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>

                        <input
                            placeholder="Nome (Ex: Essência Love 66)"
                            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />

                        <input
                            type="number"
                            placeholder="Preço de Venda (R$)"
                            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                            value={precoVenda}
                            onChange={(e) => setPrecoVenda(e.target.value)}
                        />

                        <button
                            disabled={isUploading}
                            className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold flex justify-center items-center gap-2 transition-all"
                        >
                            {isUploading ? <Loader2 className="animate-spin" /> : "Cadastrar Produto"}
                        </button>
                    </form>
                </section>

                {/* COLUNA 2: LISTA DE PRODUTOS */}
                <section className="lg:col-span-2">
                    <h2 className="text-xl font-semibold mb-6">Produtos Cadastrados</h2>

                    {loading ? <p className="text-slate-400">Carregando...</p> : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {products.map((product) => (
                                <div key={product.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-lg bg-slate-900 flex-shrink-0 overflow-hidden border border-slate-700">
                                        {product.foto_url ? (
                                            <img src={product.foto_url} className="w-full h-full object-cover" alt={product.nome} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600">SEM FOTO</div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold truncate">{product.nome}</p>
                                        <p className="text-emerald-400 text-sm">R$ {product.preco_venda}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

            </div>
        </div>
    );
}