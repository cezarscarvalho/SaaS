import { useEffect, useState } from "react";
import { getOrders, createOrder, addOrderItems } from "@/services/orderService";
import { useCompany } from "@/context/CompanyContext";

export default function Orders() {
    const { company } = useCompany();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    // --- PARTE NOVA: ESTADO DO CARRINHO ---
    const [cart, setCart] = useState([]);

    // Função para carregar histórico (já tínhamos)
    async function fetchOrders() {
        if (!company) return;
        setLoading(true);
        try {
            const data = await getOrders(company.id);
            setOrders(data);
        } catch (err) { console.error("Erro ao carregar pedidos"); }
        finally { setLoading(false); }
    }

    useEffect(() => { fetchOrders(); }, [company]);

    // --- PARTE NOVA: LÓGICA DE CHECKOUT ---
    const handleCheckout = async (clienteId = null) => {
        if (cart.length === 0) return alert("Carrinho vazio!");

        const totalPedido = cart.reduce((acc, item) => acc + (item.preco_unitario * item.quantidade), 0);

        try {
            const novoPedido = await createOrder({
                company_id: company.id,
                cliente_id: clienteId, // Pode ser null se for venda rápida
                total: totalPedido,
                status: 'pago'
            });

            const itensParaSalvar = cart.map(item => ({
                pedido_id: novoPedido.id,
                produto_id: item.produto_id,
                quantidade: item.quantidade,
                preco_unitario: item.preco_unitario,
                company_id: company.id
            }));

            await addOrderItems(itensParaSalvar);
            alert("Venda realizada com sucesso!");
            setCart([]);      // Limpa o carrinho
            fetchOrders();    // Atualiza a lista de histórico abaixo
        } catch (error) {
            alert("Erro ao finalizar venda.");
        }
    };

    return (
        <div className="p-6 text-white">
            <h1 className="text-3xl font-bold mb-6">Módulo de Vendas</h1>

            {/* SEÇÃO 1: PDV / CARRINHO (Acréscimo) */}
            <section className="mb-10 p-4 bg-slate-800 rounded-xl border border-blue-500/30">
                <h2 className="text-xl font-semibold mb-4 text-blue-400">Novo Pedido (Carrinho)</h2>
                {cart.length === 0 ? (
                    <p className="text-slate-400 italic">O carrinho está vazio. Adicione produtos.</p>
                ) : (
                    <div className="space-y-2">
                        {cart.map((item, index) => (
                            <div key={index} className="flex justify-between border-b border-slate-700 py-1">
                                <span>{item.nome} x{item.quantidade}</span>
                                <span>R$ {item.preco_unitario * item.quantidade}</span>
                            </div>
                        ))}
                        <button
                            onClick={() => handleCheckout()}
                            className="mt-4 w-full bg-emerald-600 hover:bg-emerald-500 py-2 rounded-lg font-bold transition-all"
                        >
                            Finalizar Venda (Checkout)
                        </button>
                    </div>
                )}
            </section>

            <hr className="border-slate-700 mb-10" />

            {/* SEÇÃO 2: HISTÓRICO (O que já tínhamos) */}
            <section>
                <h2 className="text-xl font-semibold mb-4 text-slate-300">Histórico de Pedidos</h2>
                {loading ? <p>Carregando histórico...</p> : (
                    <div className="grid gap-4">
                        {orders.map(order => (
                            <div key={order.id} className="p-4 bg-slate-900/50 rounded-lg border border-slate-800 flex justify-between items-center">
                                <div>
                                    <p className="text-blue-400 font-mono"># {order.id}</p>
                                    <p className="text-xs text-slate-500">{new Date(order.created_at).toLocaleString()}</p>
                                </div>
                                <span className="text-xl font-bold text-emerald-500">R$ {order.total}</span>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}