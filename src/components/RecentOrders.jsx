export default function RecentOrders() {

    const pedidos = [
        { id: 1023, cliente: "João", valor: "80", status: "Entregue" },
        { id: 1024, cliente: "Maria", valor: "55", status: "Preparando" },
        { id: 1025, cliente: "Pedro", valor: "120", status: "Enviado" }
    ]

    return (

        <div style={{
            marginTop: "40px",
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
        }}>

            <h2>Pedidos Recentes</h2>

            <table width="100%" style={{ marginTop: "20px" }}>

                <thead>

                    <tr style={{ textAlign: "left" }}>
                        <th>Pedido</th>
                        <th>Cliente</th>
                        <th>Valor</th>
                        <th>Status</th>
                    </tr>

                </thead>

                <tbody>

                    {pedidos.map(p => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.cliente}</td>
                            <td>R$ {p.valor}</td>
                            <td>{p.status}</td>
                        </tr>
                    ))}

                </tbody>

            </table>

        </div>

    )

}