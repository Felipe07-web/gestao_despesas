import React, { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

const TiposGastos = () => {
    const [tiposGastos, setTiposGastos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        indice_tipo: "",
        tipo: "",
        indice_subtipo_1: "",
        subtipo_1: "",
        indice_subtipo_2: "",
        subtipo_2: "",
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchTiposGastos();
    }, []);

    // 🔹 Buscar tipos de gastos (GET)
    const fetchTiposGastos = async () => {
        try {
            const response = await axios.get("http://localhost/api/tipos-gastos", {
                credentials: "include",
            });
            setTiposGastos(response.data);
        } catch (error) {
            console.error("Erro ao buscar tipos de gastos:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // 🔹 Atualizar o estado do formulário
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 🔹 Criar ou Editar um tipo de gasto (POST/PUT)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.values(formData).some((field) => String(field).trim() === "")) {
            alert("Todos os campos são obrigatórios.");
            return;
        }

        try {
            const url = editingId ? `http://localhost/api/tipos-gastos/${editingId}` : "http://localhost/api/tipos-gastos";
            const method = editingId ? "PUT" : "POST";

            await axios({
                method,
                url,
                data: formData,
                withCredentials: true,
            });

            fetchTiposGastos();
            setFormData({
                indice_tipo: "",
                tipo: "",
                indice_subtipo_1: "",
                subtipo_1: "",
                indice_subtipo_2: "",
                subtipo_2: "",
            });
            setEditingId(null);
        } catch (error) {
            console.error("Erro ao salvar tipo de gasto:", error);
            alert("Erro ao salvar tipo de gasto.");
        }
    };

    // 🔹 Editar um tipo de gasto
    const handleEdit = (gasto) => {
        setFormData({
            indice_tipo: gasto.indice_tipo,
            tipo: gasto.tipo,
            indice_subtipo_1: gasto.indice_subtipo_1,
            subtipo_1: gasto.subtipo_1,
            indice_subtipo_2: gasto.indice_subtipo_2,
            subtipo_2: gasto.subtipo_2,
        });
        setEditingId(gasto.id);
    };

    // 🔹 Excluir tipo de gasto (DELETE)
    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este registro?")) {
            try {
                await axios.delete(`http://localhost/api/tipos-gastos/${id}`, {
                    withCredentials: true,
                });
                fetchTiposGastos();
            } catch (error) {
                console.error("Erro ao excluir tipo de gasto:", error);
                alert("Erro ao excluir tipo de gasto.");
            }
        }
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-full">Carregando...</div>;
    }

    return (
        <div className="p-8 bg-white shadow-xl rounded-xl">
            <h1 className="text-3xl font-extrabold mb-6 text-gray-900 tracking-tight">Gerenciamento de Tipos de Gastos</h1>

            {/* Formulário de Cadastro/Edição */}
            <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap gap-4">
                <input name="indice_tipo" type="number" placeholder="Índice Tipo" value={formData.indice_tipo} onChange={handleInputChange} className="border p-2 rounded w-full md:w-1/4" required />
                <input name="tipo" type="text" placeholder="Tipo" value={formData.tipo} onChange={handleInputChange} className="border p-2 rounded w-full md:w-1/4" required />
                <input name="indice_subtipo_1" type="number" placeholder="Índice Subtipo 1" value={formData.indice_subtipo_1} onChange={handleInputChange} className="border p-2 rounded w-full md:w-1/4" required />
                <input name="subtipo_1" type="text" placeholder="Subtipo 1" value={formData.subtipo_1} onChange={handleInputChange} className="border p-2 rounded w-full md:w-1/4" required />
                <input name="indice_subtipo_2" type="number" placeholder="Índice Subtipo 2" value={formData.indice_subtipo_2} onChange={handleInputChange} className="border p-2 rounded w-full md:w-1/4" required />
                <input name="subtipo_2" type="text" placeholder="Subtipo 2" value={formData.subtipo_2} onChange={handleInputChange} className="border p-2 rounded w-full md:w-1/4" required />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    {editingId ? "Atualizar" : "Adicionar"}
                </button>
            </form>

            {/* Tabela de Tipos de Gastos */}
            <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="w-full table-auto">
                    <thead className="bg-gray-50 text-gray-700 uppercase text-sm tracking-wider">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium">Índice Tipo</th>
                            <th className="px-6 py-3 text-left font-medium">Tipo</th>
                            <th className="px-6 py-3 text-left font-medium">Índice Subtipo 1</th>
                            <th className="px-6 py-3 text-left font-medium">Subtipo 1</th>
                            <th className="px-6 py-3 text-left font-medium">Índice Subtipo 2</th>
                            <th className="px-6 py-3 text-left font-medium">Subtipo 2</th>
                            <th className="px-6 py-3 text-left font-medium">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tiposGastos.map((gasto, index) => (
                            <tr key={gasto.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-all duration-200`}>
                                <td className="px-6 py-4 text-gray-800">{gasto.indice_tipo}</td>
                                <td className="px-6 py-4 text-gray-700">{gasto.tipo}</td>
                                <td className="px-6 py-4 text-gray-700">{gasto.indice_subtipo_1}</td>
                                <td className="px-6 py-4 text-gray-700">{gasto.subtipo_1}</td>
                                <td className="px-6 py-4 text-gray-700">{gasto.indice_subtipo_2}</td>
                                <td className="px-6 py-4 text-gray-700">{gasto.subtipo_2}</td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button onClick={() => handleEdit(gasto)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">Editar</button>
                                    <button onClick={() => handleDelete(gasto.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TiposGastos;
