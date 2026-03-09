export default function CardMetric({ title, value }) {

    return (

        <div style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            flex: 1
        }}>

            <p style={{ color: "#6b7280", fontSize: "14px" }}>
                {title}
            </p>

            <h2 style={{ marginTop: "10px" }}>
                {value}
            </h2>

        </div>

    )

}