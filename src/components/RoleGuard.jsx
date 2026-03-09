import { Navigate } from "react-router-dom";
import { useCompany } from "@/context/CompanyContext";

export default function RoleGuard({ children, allowedRoles }) {
    const { role, loadingCompany } = useCompany();

    if (loadingCompany) return <div className="bg-[#0f172a] h-screen" />;

    if (!allowedRoles.includes(role)) {
        return <Navigate to="/access-denied" replace />;
    }

    return children;
}