"use client";

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

    // 🔄 Buscar tipos de ganhos da API
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

    // ✏ Atualizar estado do formulário
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 💾 Criar ou atualizar tipo de ganho
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.indice_tipo || !formData.tipo) {
            alert("Todos os campos são obrigatórios.");
            return;
        }

        try {
            const url = editingId
                ? `http://localhost/api/tipos-ganhos/${editingId}`
                : "http://localhost/api/tipos-ganhos";
            const method = editingId ? "PUT" : "POST";

            await axios({
                method,
                url,
                data: formData,
                withCredentials: true,
            });

            fetchTiposGanhos();
            setFormData({ indice_tipo: "", tipo: "" });
            setEditingId(null);
        } catch (error) {
            console.error("Erro ao salvar tipo de ganho:", error);
            alert("Erro ao salvar tipo de ganho.");
        }
    };

    // 📝 Editar tipo de ganho
    const handleEdit = (ganho) => {
        setFormData({
            indice_tipo: ganho.indice_tipo,
            tipo: ganho.tipo,
        });
        setEditingId(ganho.id);
    };

    // 🗑 Excluir tipo de ganho
    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este tipo de ganho?")) {
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
        <div className="min-h-screen bg-gray-100 p-8">
            {/* Cabeçalho */}
            <header className="bg-blue-900 text-white p-6 rounded-lg shadow-lg text-center">
                <h1 className="text-3xl font-bold">Gerenciamento de Tipos de Ganhos</h1>
                <p className="text-gray-300 mt-2">
                    Adicione, edite e gerencie os tipos de ganhos cadastrados.
                </p>
            </header>

            {/* Formulário */}
            <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                    {editingId ? "Editar Tipo de Ganho" : "Adicionar Tipo de Ganho"}
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        name="indice_tipo"
                        type="number"
                        value={formData.indice_tipo}
                        onChange={handleInputChange}
                        placeholder="Índice Tipo"
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        name="tipo"
                        type="text"
                        value={formData.tipo}
                        onChange={handleInputChange}
                        placeholder="Tipo"
                        className="border p-2 rounded"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                    >
                        {editingId ? "Atualizar" : "Adicionar"}
                    </button>
                </form>
            </div>

            {/* Tabela de Tipos de Ganhos */}
            <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Lista de Tipos de Ganhos</h2>
                <table className="w-full border-collapse rounded-lg">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium">Índice Tipo</th>
                            <th className="px-6 py-3 text-left font-medium">Tipo</th>
                            <th className="px-6 py-3 text-left font-medium">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tiposGanhos.map((ganho) => (
                            <tr key={ganho.id} className="border-t hover:bg-gray-100 transition">
                                <td className="px-6 py-4">{ganho.indice_tipo}</td>
                                <td className="px-6 py-4">{ganho.tipo}</td>
                                <td className="px-6 py-4 flex justify-center space-x-2">
                                    <button onClick={() => handleEdit(ganho)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">
                                        Editar
                                    </button>
                                    <button onClick={() => handleDelete(ganho.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">
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

export default TiposGanhos;
