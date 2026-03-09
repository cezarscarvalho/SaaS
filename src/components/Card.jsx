export default function Card({ title, value }) {

    return (

        <div style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            minWidth: "200px"
        }}>

            <p style={{ color: "#6b7280" }}>{title}</p>

            <h2>{value}</h2>

        </div>

    )

}