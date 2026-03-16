import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import PainelDeVendas from "./modules/analytics/SalesReport";
import AdminLayout from "./layouts/AdminLayout";
import { CompanyProvider } from "./context/CompanyContext";
import ProtectedRoute from "./components/admin/ProtectedRoute";

import Login from "./modules/auth/pages/Login";
import Dashboard from "./modules/dashboard/pages/Dashboard";
import Products from "./modules/products/pages/Products";
import PDV from "./pages/admin/PDV";
import CashierControl from "./modules/cashier/pages/CashierControl";

function App() {
  return (
    <BrowserRouter>
      <CompanyProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/admin" replace />} />

          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<PDV />} />
            <Route path="pdv" element={<PDV />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="cashier" element={<CashierControl />} />
            <Route path="products" element={<Products />} />
            <Route path="reports" element={<PainelDeVendas />} />
          </Route>
        </Routes>
      </CompanyProvider>
    </BrowserRouter>
  );
}

export default App;