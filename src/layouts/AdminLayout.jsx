import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
// ... outros imports
import { supabase } from "../lib/supabase";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Settings,
  LogOut,
  Menu,
  X,
  Zap
} from 'lucide-react';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar /> {/* Seu menu lateral */}

      <main className="flex-1 overflow-y-auto p-8">
        {/* O Outlet é onde as páginas (Dashboard, PDV, etc) aparecem */}
        <Outlet />
      </main>
    </div>
  );


  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const menuItems = [
    { path: "/admin", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { path: "/admin/pdv", icon: <ShoppingCart size={20} />, label: "PDV (Vendas)" },
    { path: "/admin/products", icon: <Package size={20} />, label: "Estoque" },
    { path: "/admin/settings", icon: <Settings size={20} />, label: "Configurações" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 shadow-sm">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-100">
            <Zap size={24} fill="currentColor" />
          </div>
          <span className="font-black text-xl text-gray-900 tracking-tight text-nowrap">Tabacaria Pro</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${isActive(item.path)
                ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 font-bold hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut size={20} />
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER & MENU */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="md:hidden bg-white border-b border-gray-100 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Zap size={20} className="text-indigo-600" fill="currentColor" />
            <span className="font-black text-lg">Tabacaria</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-500">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* ÁREA DE CONTEÚDO (Onde as páginas aparecem) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50/50">
          <Outlet />
        </main>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white md:hidden animate-in slide-in-from-right duration-300">
          <div className="p-6 flex justify-between items-center border-b">
            <span className="font-black text-xl">Menu</span>
            <button onClick={() => setIsMobileMenuOpen(false)}><X size={28} /></button>
          </div>
          <nav className="p-6 space-y-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-4 p-4 rounded-2xl text-lg font-black ${isActive(item.path) ? 'bg-indigo-600 text-white' : 'text-gray-500'
                  }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 w-full p-4 text-red-500 font-black text-lg"
            >
              <LogOut size={24} /> Sair
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;