import { Outlet, Link, useNavigate } from "react-router-dom";
import { useCompany } from "@/context/CompanyContext";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut
} from "lucide-react";

export default function AdminLayout() {
  const { role } = useCompany();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 text-2xl font-bold text-blue-500 border-b border-slate-800">
          Tabacaria SaaS
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition-all">
            <LayoutDashboard size={20} /> Dashboard
          </Link>

          <Link to="/admin/products" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition-all">
            <Package size={20} /> Produtos
          </Link>

          <Link to="/admin/PDV" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition-all">
            <ShoppingCart size={20} /> Vendas
          </Link>

          {/* SÓ MOSTRA SE FOR OWNER OU ADMIN */}
          {(role === 'owner' || role === 'admin') && (
            <Link to="/admin/settings" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition-all">
              <Settings size={20} /> Configurações
            </Link>
          )}
        </nav>

        <button
          onClick={handleLogout}
          className="p-4 flex items-center gap-3 hover:bg-red-500/10 text-red-400 transition-all border-t border-slate-800"
        >
          <LogOut size={20} /> Sair
        </button>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}