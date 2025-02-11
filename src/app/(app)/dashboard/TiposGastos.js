"use client";

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

    // 🔄 Buscar tipos de gastos da API
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

    // ✏ Atualizar estado do formulário
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 💾 Criar ou atualizar tipo de gasto
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.indice_tipo || !formData.tipo || !formData.indice_subtipo_1 || !formData.subtipo_1 || !formData.indice_subtipo_2 || !formData.subtipo_2) {
            alert("Todos os campos são obrigatórios.");
            return;
        }

        try {
            const url = editingId
                ? `http://localhost/api/tipos-gastos/${editingId}`
                : "http://localhost/api/tipos-gastos";
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

    // 📝 Editar tipo de gasto
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

    // 🗑 Excluir tipo de gasto
    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este tipo de gasto?")) {
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
        <div className="min-h-screen bg-gray-100 p-8">
            {/* Cabeçalho */}
            <header className="bg-blue-900 text-white p-6 rounded-lg shadow-lg text-center">
                <h1 className="text-3xl font-bold">Gerenciamento de Tipos de Gastos</h1>
                <p className="text-gray-300 mt-2">
                    Adicione, edite e gerencie os tipos de gastos cadastrados.
                </p>
            </header>

            {/* Formulário */}
            <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                    {editingId ? "Editar Tipo de Gasto" : "Adicionar Tipo de Gasto"}
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <input
                        name="indice_subtipo_1"
                        type="number"
                        value={formData.indice_subtipo_1}
                        onChange={handleInputChange}
                        placeholder="Índice Subtipo 1"
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        name="subtipo_1"
                        type="text"
                        value={formData.subtipo_1}
                        onChange={handleInputChange}
                        placeholder="Subtipo 1"
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        name="indice_subtipo_2"
                        type="number"
                        value={formData.indice_subtipo_2}
                        onChange={handleInputChange}
                        placeholder="Índice Subtipo 2"
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        name="subtipo_2"
                        type="text"
                        value={formData.subtipo_2}
                        onChange={handleInputChange}
                        placeholder="Subtipo 2"
                        className="border p-2 rounded"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition col-span-full"
                    >
                        {editingId ? "Atualizar" : "Adicionar"}
                    </button>
                </form>
            </div>

            {/* Tabela de Tipos de Gastos */}
            <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Lista de Tipos de Gastos</h2>
                <table className="w-full border-collapse rounded-lg">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left">Índice Tipo</th>
                            <th className="px-4 py-3 text-left">Tipo</th>
                            <th className="px-4 py-3 text-left">Índice Subtipo 1</th>
                            <th className="px-4 py-3 text-left">Subtipo 1</th>
                            <th className="px-4 py-3 text-left">Índice Subtipo 2</th>
                            <th className="px-4 py-3 text-left">Subtipo 2</th>
                            <th className="px-4 py-3 text-left">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tiposGastos.map((gasto) => (
                            <tr key={gasto.id} className="border-t hover:bg-gray-100 transition">
                                <td className="px-4 py-3">{gasto.indice_tipo}</td>
                                <td className="px-4 py-3">{gasto.tipo}</td>
                                <td className="px-4 py-3">{gasto.indice_subtipo_1}</td>
                                <td className="px-4 py-3">{gasto.subtipo_1}</td>
                                <td className="px-4 py-3">{gasto.indice_subtipo_2}</td>
                                <td className="px-4 py-3">{gasto.subtipo_2}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TiposGastos;
