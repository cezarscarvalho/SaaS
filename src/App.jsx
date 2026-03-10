import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CompanyProvider } from "@/context/CompanyContext";

// Segurança e Layout
import AdminLayout from "@/layouts/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleGuard from "@/components/RoleGuard";
import AccessDenied from "@/pages/AccessDenied";

// Módulos
import Dashboard from "@/modules/dashboard/pages/Dashboard";
import Products from "@/modules/products/pages/Products"; // Listagem que acabamos de criar
import Settings from "@/modules/settings/pages/Settings";
import Login from "@/pages/auth/Login";

function App() {
  return (
    <BrowserRouter>
      <CompanyProvider>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/access-denied" element={<AccessDenied />} />

          {/* Redirecionamento Inicial */}
          <Route path="/" element={<Navigate to="/admin" replace />} />

          {/* Área Protegida (SaaS Admin) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard: Acesso para todos os funcionários */}
            <index element={<Dashboard />} />
            <Route index element={<Dashboard />} />

            {/* Módulo de Produtos */}
            <Route path="products">
              {/* Listagem principal */}
              <Route index element={
                <RoleGuard allowedRoles={['owner', 'admin', 'staff']}>
                  <Products />
                </RoleGuard>
              } />

              {/* Cadastro de novo produto */}
              <Route path="new" element={
                <RoleGuard allowedRoles={['owner', 'admin']}>
                  <ProductForm />
                </RoleGuard>
              } />
            </Route>

            {/* Configurações: Apenas o Dono (Owner) altera dados da empresa */}
            <Route path="settings" element={
              <RoleGuard allowedRoles={['owner']}>
                <Settings />
              </RoleGuard>
            } />
          </Route>

          {/* Rota 404 - Caso o usuário digite algo errado */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </CompanyProvider>
    </BrowserRouter>
  );
}

export default App;