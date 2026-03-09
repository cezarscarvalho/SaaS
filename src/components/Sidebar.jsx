export default function Sidebar() {
    return (

        <div style={{
            width: "220px",
            background: "#111827",
            color: "#fff",
            padding: "20px"
        }}>

            <h2>Tabacaria SaaS</h2>

            <ul style={{ listStyle: "none", padding: 0 }}>

                <li>Dashboard</li>
                <li>Clientes</li>
                <li>Produtos</li>
                <li>Pedidos</li>
                <li>Fornecedores</li>

            </ul>

        </div>

    );
}