import React, { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

const TiposGanhos = () => {
    const [tiposGanhos, setTiposGanhos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        indice_tipo: "",
        tipo: "",
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchTiposGanhos();
    }, []);

    // 🔹 Buscar tipos de ganhos (GET)
    const fetchTiposGanhos = async () => {
        try {
            const response = await axios.get("http://localhost/api/tipos-ganhos", {
                credentials: "include",
            });
            setTiposGanhos(response.data);
        } catch (error) {
            console.error("Erro ao buscar tipos de ganhos:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // 🔹 Atualizar o estado do formulário
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 🔹 Criar ou Editar um tipo de ganho (POST/PUT)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.values(formData).some((field) => String(field).trim() === "")) {
            alert("Todos os campos são obrigatórios.");
            return;
        }

        try {
            const url = editingId ? `http://localhost/api/tipos-ganhos/${editingId}` : "http://localhost/api/tipos-ganhos";
            const method = editingId ? "PUT" : "POST";

            await axios({
                method,
                url,
                data: formData,
                withCredentials: true,
            });

            fetchTiposGanhos();
            setFormData({
                indice_tipo: "",
                tipo: "",
            });
            setEditingId(null);
        } catch (error) {
            console.error("Erro ao salvar tipo de ganho:", error);
            alert("Erro ao salvar tipo de ganho.");
        }
    };

    // 🔹 Editar um tipo de ganho
    const handleEdit = (ganho) => {
        setFormData({
            indice_tipo: ganho.indice_tipo,
            tipo: ganho.tipo,
        });
        setEditingId(ganho.id);
    };

    // 🔹 Excluir tipo de ganho (DELETE)
    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este registro?")) {
            try {
                await axios.delete(`http://localhost/api/tipos-ganhos/${id}`, {
                    withCredentials: true,
                });
                fetchTiposGanhos();
            } catch (error) {
                console.error("Erro ao excluir tipo de ganho:", error);
                alert("Erro ao excluir tipo de ganho.");
            }
        }
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-full">Carregando...</div>;
    }

    return (
        <div className="p-8 bg-white shadow-xl rounded-xl">
            <h1 className="text-3xl font-extrabold mb-6 text-gray-900 tracking-tight">Gerenciamento de Tipos de Ganhos</h1>

            {/* Formulário de Cadastro/Edição */}
            <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap gap-4">
                <input name="indice_tipo" type="number" placeholder="Índice Tipo" value={formData.indice_tipo} onChange={handleInputChange} className="border p-2 rounded w-full md:w-1/3" required />
                <input name="tipo" type="text" placeholder="Tipo" value={formData.tipo} onChange={handleInputChange} className="border p-2 rounded w-full md:w-1/3" required />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    {editingId ? "Atualizar" : "Adicionar"}
                </button>
            </form>

            {/* Tabela de Tipos de Ganhos */}
            <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="w-full table-auto">
                    <thead className="bg-gray-50 text-gray-700 uppercase text-sm tracking-wider">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium">Índice Tipo</th>
                            <th className="px-6 py-3 text-left font-medium">Tipo</th>
                            <th className="px-6 py-3 text-left font-medium">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tiposGanhos.map((ganho, index) => (
                            <tr key={ganho.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-all duration-200`}>
                                <td className="px-6 py-4 text-gray-800">{ganho.indice_tipo}</td>
                                <td className="px-6 py-4 text-gray-700">{ganho.tipo}</td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button onClick={() => handleEdit(ganho)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">Editar</button>
                                    <button onClick={() => handleDelete(ganho.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TiposGanhos;
