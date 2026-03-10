import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AccessDenied() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white p-6">
            <div className="p-4 bg-red-500/10 rounded-full text-red-500 mb-6">
                <ShieldAlert size={64} />
            </div>
            <h1 className="text-3xl font-bold mb-2">Acesso Restrito</h1>
            <p className="text-slate-400 text-center max-w-md mb-8">
                Seu cargo atual não permite visualizar esta página. Se você acredita que isso é um erro, solicite a alteração ao dono da conta.
            </p>
            <button
                onClick={() => navigate("/admin")}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-6 py-2 rounded-lg transition-all border border-slate-700"
            >
                <ArrowLeft size={20} /> Voltar ao Painel
            </button>
        </div>
    );
}