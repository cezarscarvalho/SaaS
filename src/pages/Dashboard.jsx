import MainLayout from "../layouts/MainLayout"

import CardMetric from "../components/CardMetric"
import SalesChart from "../components/SalesChart"
import RecentOrders from "../components/RecentOrders"

export default function Dashboard() {

    return (

        <MainLayout>

            <h1>Dashboard</h1>

            <div style={{
                display: "flex",
                gap: "20px",
                marginTop: "20px"
            }}>

                <CardMetric title="Vendas Hoje" value="R$1.200" />

                <CardMetric title="Pedidos" value="32" />

                <CardMetric title="Clientes" value="128" />

                <CardMetric title="Produtos" value="54" />

            </div>

            <div style={{
                marginTop: "30px"
            }}>

                <SalesChart />

            </div>

            <div style={{
                marginTop: "30px"
            }}>

                <RecentOrders />

            </div>

        </MainLayout>

    )

}