import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts"

const data = [
    { name: "Seg", vendas: 400 },
    { name: "Ter", vendas: 300 },
    { name: "Qua", vendas: 500 },
    { name: "Qui", vendas: 200 },
    { name: "Sex", vendas: 700 },
]

export default function SalesChart() {

    return (

        <div style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            height: "300px"
        }}>

            <h3>Vendas da Semana</h3>

            <ResponsiveContainer width="100%" height="90%">

                <LineChart data={data}>

                    <XAxis dataKey="name" />

                    <YAxis />

                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="vendas"
                        stroke="#6366f1"
                        strokeWidth={3}
                    />

                </LineChart>

            </ResponsiveContainer>

        </div>

    )

}