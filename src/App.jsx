import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CompanyProvider } from "@/context/CompanyContext";

// Segurança e Layout
import AdminLayout from "@/layouts/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleGuard from "@/components/RoleGuard";
import AccessDenied from "@/pages/AccessDenied";

// Módulos
import Dashboard from "@/modules/dashboard/pages/Dashboard";
import Products from "@/modules/products/pages/Products";
import Settings from "@/modules/settings/pages/Settings";
import Login from "@/pages/auth/Login";
import PDV from "@/pages/admin/PDV";

function App() {
  return (
    <BrowserRouter>
      <CompanyProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/access-denied" element={<AccessDenied />} />

          {/* Área Protegida */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />

            {/* Acesso Geral */}
            <Route path="products" element={
              <RoleGuard allowedRoles={['owner', 'admin', 'staff']}><Products /></RoleGuard>
            } />

            {/* Acesso Restrito ao Dono */}
            <Route path="settings" element={
              <RoleGuard allowedRoles={['owner']}><Settings /></RoleGuard>
            } />
          </Route>
        </Routes>
      </CompanyProvider>
    </BrowserRouter>
  );
}
export default App;