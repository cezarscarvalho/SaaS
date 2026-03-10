import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts e Provedores
import AdminLayout from "./layouts/AdminLayout";
import { CompanyProvider } from "./context/CompanyContext";
import ProtectedRoute from "./components/admin/ProtectedRoute.jsx";

// Páginas de Autenticação
import Login from "./modules/auth/pages/Login";
import ResetPassword from "./modules/auth/pages/ResetPassword";
import AccessDenied from "./modules/auth/pages/AccessDenied";

// Páginas Administrativas
import Dashboard from "./modules/dashboard/pages/Dashboard";
import Products from "./modules/products/pages/Products";
import PDV from "./pages/admin/PDV";
import Settings from "./modules/settings/pages/Settings";
import SalesReport from "./modules/reports/pages/SalesReport";
import CashierControl from "./modules/cashier/pages/CashierControl"; // Nova página de Caixa

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
            {/* Página inicial do Admin (Abre o PDV por padrão) */}
            <Route index element={<PDV />} />
            <Route path="pdv" element={<PDV />} />

            {/* Sub-rotas do Painel Administrativo */}
            <Route path="dashboard" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
            <Route path="cashier" element={<CashierControl />} /> {/* Rota do Fluxo de Caixa */}
            <Route path="products" element={<ProtectedRoute adminOnly><Products /></ProtectedRoute>} />
            <Route path="reports" element={<ProtectedRoute adminOnly><SalesReport /></ProtectedRoute>} />
            <Route path="settings" element={<ProtectedRoute adminOnly><Settings /></ProtectedRoute>} />
          </Route>

          {/* Rota de escape para páginas inexistentes */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </CompanyProvider>
    </BrowserRouter>
  );
}

export default App;