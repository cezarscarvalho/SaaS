import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts e Provedores
import AdminLayout from "./layouts/AdminLayout";
import { CompanyProvider } from "./context/CompanyContext";
import ProtectedRoute from "./components/admin/ProtectedRoute";

// Páginas de Autenticação
import Login from "./modules/auth/pages/Login";
import ResetPassword from "./modules/auth/pages/ResetPassword";

// Páginas Administrativas
import Dashboard from "./modules/dashboard/pages/Dashboard";
import Products from "./modules/products/pages/Products";
import PDV from "./pages/admin/PDV";
import Settings from "./modules/settings/pages/Settings";

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

          {/* Redirecionamento Inicial */}
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
            {/* O "index" faz com que o Dashboard seja a página inicial de /admin */}
            <Route index element={<Dashboard />} />

            {/* Rota do PDV - Frente de Caixa */}
            <Route path="pdv" element={<PDV />} />

            {/* Gestão de Produtos e Estoque */}
            <Route path="products" element={<Products />} />

            {/* Configurações do Sistema */}
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Rota de Erro 404 (Opcional) */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </CompanyProvider>
    </BrowserRouter>
  );
}

export default App;