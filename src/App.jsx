import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts e Provedores
import AdminLayout from "./layouts/AdminLayout";
import { CompanyProvider } from "./context/CompanyContext";
import ProtectedRoute from "./components/admin/ProtectedRoute.jsx";

// Páginas de Autenticação
import Login from "./modules/auth/pages/Login";
import ResetPassword from "./modules/auth/pages/ResetPassword";

// Páginas Administrativas
import Dashboard from "./modules/dashboard/pages/Dashboard";
import Products from "./modules/products/pages/Products";
import PDV from "./pages/admin/PDV";
import Settings from "./modules/settings/pages/Settings";
import SalesReport from "./modules/reports/pages/SalesReport"; // Nosso novo relatório

// Outras páginas
import AccessDenied from "./modules/auth/pages/AccessDenied";

function App() {
  return (
    <BrowserRouter>
      <CompanyProvider>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/access-denied" element={<AccessDenied />} />

          <Route path="/" element={<Navigate to="/admin" replace />} />

          {/* Área Administrativa Protegida */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* O PDV é a única rota que Vendedores e Admins acessam livremente */}
            <Route index element={<PDV />} />
            <Route path="pdv" element={<PDV />} />

            {/* Rotas EXCLUSIVAS para Admins (adminOnly) */}
            <Route
              path="dashboard"
              element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>}
            />
            <Route
              path="products"
              element={<ProtectedRoute adminOnly><Products /></ProtectedRoute>}
            />
            <Route
              path="reports"
              element={<ProtectedRoute adminOnly><SalesReport /></ProtectedRoute>}
            />
            <Route
              path="settings"
              element={<ProtectedRoute adminOnly><Settings /></ProtectedRoute>}
            />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </CompanyProvider>
    </BrowserRouter>
  );
}

export default App;