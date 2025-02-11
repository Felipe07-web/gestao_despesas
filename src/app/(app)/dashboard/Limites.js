"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

const Limites = () => {
    const [limites, setLimites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        subtipo_2: "",
        valor: "",
        periodicidade: "",
        numero_meses: "",
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchLimites();
    }, []);

    // 🔄 Buscar limites da API
    const fetchLimites = async () => {
        try {
            const response = await axios.get("http://localhost/api/limites", {
                credentials: "include",
            });
            setLimites(response.data);
        } catch (error) {
            console.error("Erro ao buscar limites:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // ✏ Atualizar estado do formulário
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 💾 Salvar ou atualizar limite
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.values(formData).some((field) => String(field).trim() === "")) {
            alert("Todos os campos são obrigatórios.");
            return;
        }

        try {
            const url = editingId
                ? `http://localhost/api/limites/${editingId}`
                : "http://localhost/api/limites";
            const method = editingId ? "PUT" : "POST";

            await axios({
                method,
                url,
                data: formData,
                withCredentials: true,
            });

            fetchLimites();
            setFormData({
                subtipo_2: "",
                valor: "",
                periodicidade: "",
                numero_meses: "",
            });
            setEditingId(null);
        } catch (error) {
            console.error("Erro ao salvar limite:", error);
            alert("Erro ao salvar limite.");
        }
    };

    // 📝 Editar limite
    const handleEdit = (limite) => {
        setFormData({
            subtipo_2: limite.subtipo_2,
            valor: limite.valor,
            periodicidade: limite.periodicidade,
            numero_meses: limite.numero_meses,
        });
        setEditingId(limite.id);
    };

    // 🗑 Excluir limite
    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este limite?")) {
            try {
                await axios.delete(`http://localhost/api/limites/${id}`, {
                    withCredentials: true,
                });
                fetchLimites();
            } catch (error) {
                console.error("Erro ao excluir limite:", error);
                alert("Erro ao excluir limite.");
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
                <h1 className="text-3xl font-bold">Gerenciamento de Limites</h1>
                <p className="text-gray-300 mt-2">
                    Defina limites para melhor controle financeiro.
                </p>
            </header>

            {/* Formulário */}
            <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                    {editingId ? "Editar Limite" : "Adicionar Limite"}
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        name="subtipo_2"
                        type="text"
                        value={formData.subtipo_2}
                        onChange={handleInputChange}
                        placeholder="Subtipo 2"
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        name="valor"
                        type="number"
                        step="0.01"
                        value={formData.valor}
                        onChange={handleInputChange}
                        placeholder="Valor"
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        name="periodicidade"
                        type="text"
                        value={formData.periodicidade}
                        onChange={handleInputChange}
                        placeholder="Periodicidade"
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        name="numero_meses"
                        type="number"
                        value={formData.numero_meses}
                        onChange={handleInputChange}
                        placeholder="Número de Meses"
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

            {/* Tabela de Limites */}
            <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Lista de Limites</h2>
                <table className="w-full border-collapse rounded-lg">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium">Subtipo 2</th>
                            <th className="px-6 py-3 text-right font-medium">Valor</th>
                            <th className="px-4 py-3 text-center font-medium">Periodicidade</th>
                            <th className="px-4 py-3 text-center font-medium">Meses</th>
                            <th className="px-6 py-3 text-left font-medium">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {limites.map((limite) => (
                            <tr key={limite.id} className="border-t hover:bg-gray-100 transition">
                                <td className="px-6 py-4">{limite.subtipo_2}</td>
                                <td className="px-6 py-4 text-right text-green-600 font-medium">
                                    {new Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    }).format(limite.valor)}
                                </td>
                                <td className="px-4 py-4 text-center">{limite.periodicidade}</td>
                                <td className="px-4 py-4 text-center">{limite.numero_meses}</td>
                                <td className="px-6 py-4 flex justify-center space-x-2">
                                    <button onClick={() => handleEdit(limite)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">
                                        Editar
                                    </button>
                                    <button onClick={() => handleDelete(limite.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">
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

export default Limites;
