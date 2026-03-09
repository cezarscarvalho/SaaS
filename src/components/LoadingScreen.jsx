import { Loader2 } from "lucide-react";

export default function LoadingScreen() {
    return (
        <div className="flex flex-col h-screen w-full items-center justify-center bg-[#0f172a] text-white">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
            <h2 className="text-xl font-medium animate-pulse">Carregando sistema...</h2>
            <p className="text-slate-400 text-sm mt-2">Tabacaria SaaS v1.0</p>
        </div>
    );
}