// Adicione esta função de formatação dentro do componente Settings, antes do return
const formatDocument = (value) => {
    const digits = value.replace(/\D/g, ""); // Remove tudo que não é número

    if (digits.length <= 11) {
        // Máscara de CPF: 000.000.000-00
        return digits
            .replace(/(\={11}).*/, "$1") // Limita a 11 dígitos
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
        // Máscara de CNPJ: 00.000.000/0000-00
        return digits
            .replace(/(\={14}).*/, "$1") // Limita a 14 dígitos
            .replace(/(\d{2})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1/2") // O JS às vezes briga com a barra, vamos usar replace direto
            .replace(/(\d{3})(\d{4})(\d)/, "$1.$2/$3")
            .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
    }
};

// Abaixo, a versão simplificada e robusta para o input:
const handleDocChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 14) val = val.slice(0, 14); // Trava no máximo do CNPJ

    let formatted = val;
    if (val.length <= 11) {
        formatted = val.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else {
        formatted = val.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }

    setCompany({ ...company, cnpj: formatted });
};

// NO SEU JSX, O INPUT FICARÁ ASSIM:
<div className="space-y-2">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
        <Hash size={14} /> CPF ou CNPJ
    </label>
    <input
        className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
        placeholder="000.000.000-00 ou 00.000.000/0000-00"
        value={company.cnpj}
        onChange={handleDocChange}
        maxLength={18} // Tamanho máximo com pontos e barras
    />
</div>