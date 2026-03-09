import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout({ children }) {
    return (
        <div style={{ display: "flex", height: "100vh" }}>

            <Sidebar />

            <div style={{ flex: 1, background: "#f5f6fa" }}>
                <Topbar />

                <div style={{ padding: "20px" }}>
                    {children}
                </div>

            </div>

        </div>
    );
}