import React, { useEffect, useState } from "react";

const Bancos = () => {
    const [bancos, setBancos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        data: "",
        banco: "",
        referente: "",
        valor: "",
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchBancos();
    }, []);

    // 🔄 Função para buscar todos os bancos
    const fetchBancos = async () => {
        try {
            const response = await fetch("http://127.0.0.1/api/bancos",{
                credentials: "include"
            });
            if (!response.ok) throw new Error("Erro ao buscar bancos");
            const data = await response.json();
            setBancos(data);
        } catch (error) {
            console.error("Erro ao buscar bancos:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // ✏ Função para atualizar o estado do formulário
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.values(formData).some(field => field === "")) {
            alert("Todos os campos são obrigatórios.");
            return;
        }

        try {
            const url = editingId ? `http://127.0.0.1/api/bancos/${editingId}` : `http://127.0.0.1/api/bancos`;
            const method = editingId ? "PUT" : "POST";

            // Converte a data para o formato correto (YYYY-MM-DD)
            const formattedData = {
                ...formData,
                data: new Date(formData.data).toISOString().split("T")[0]
            };

            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formattedData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(`Erro ao salvar o banco: ${result.message || "Erro desconhecido"}`);
            }

            console.log("Sucesso ao salvar:", result);
            fetchBancos();
            setFormData({ data: "", banco: "", referente: "", valor: "" });
            setEditingId(null);
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert(`Erro ao salvar: ${error.message}`);
        }
    };

    // 📝 Função para preencher o formulário ao editar
    const handleEdit = (banco) => {
        setFormData({
            data: banco.data,
            banco: banco.banco,
            referente: banco.referente,
            valor: banco.valor,
        });
        setEditingId(banco.id);
    };

    const handleDelete = async (id) => {
        console.log("🛑 Tentando excluir banco com ID:", id);
    
        if (window.confirm("Tem certeza que deseja excluir este banco?")) {
            try {
                const response = await fetch(`http://127.0.0.1/api/bancos/${id}`, { 
                    method: "DELETE",
                    headers: { 
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    }
                });
    
                const text = await response.text();
                console.log("🔄 Status da resposta:", response.status);
                console.log("🟡 Resposta da API (bruta):", text);
    
                if (!response.ok) {
                    throw new Error(`Erro ao excluir: ${response.status} - ${text}`);
                }
    
                console.log("✅ Banco excluído com sucesso!");
                fetchBancos(); // Atualiza a lista
    
            } catch (error) {
                console.error("❌ Erro ao excluir:", error);
                alert(`Erro ao excluir: ${error.message}`);
            }
        }
    };
    
    
        
    

    return (
        <div className="p-8 bg-white shadow-xl rounded-xl">
            <h1 className="text-3xl font-extrabold mb-6 text-gray-900 tracking-tight">Gestão de Bancos</h1>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap gap-4">
                <input name="data" type="date" value={formData.data} onChange={handleInputChange} className="border p-2 rounded w-full md:w-1/4" required />
                <input name="banco" type="text" value={formData.banco} onChange={handleInputChange} className="border p-2 rounded w-full md:w-1/4" required />
                <input name="referente" type="text" value={formData.referente} onChange={handleInputChange} className="border p-2 rounded w-full md:w-1/4" required />
                <input name="valor" type="number" step="0.01" value={formData.valor} onChange={handleInputChange} className="border p-2 rounded w-full md:w-1/4" required />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    {editingId ? "Atualizar" : "Adicionar"}
                </button>
            </form>

            {/* Tabela */}
            <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="w-full table-auto">
                    <thead className="bg-gray-50 text-gray-700 uppercase text-sm tracking-wider">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium">Data</th>
                            <th className="px-6 py-3 text-left font-medium">Banco</th>
                            <th className="px-6 py-3 text-left font-medium">Referente</th>
                            <th className="px-6 py-3 text-right font-medium">Valor</th>
                            <th className="px-6 py-3 text-left font-medium">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bancos.map((banco) => (
                            <tr key={banco.id} className="hover:bg-gray-100 transition-all duration-200">
                                <td className="px-6 py-4 text-gray-700 text-sm">{banco.data}</td>
                                <td className="px-6 py-4 text-gray-700">{banco.banco}</td>
                                <td className="px-6 py-4 text-gray-700">{banco.referente}</td>
                                <td className="px-6 py-4 text-right font-medium text-green-600">
                                    {banco.valor ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(banco.valor) : 'N/A'}
                                </td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button onClick={() => handleEdit(banco)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">
                                        Editar
                                    </button>
                                    <button onClick={() => handleDelete(banco.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Bancos;
