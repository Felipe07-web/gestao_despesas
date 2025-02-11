"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

const Recebimentos = () => {
    const [recebimentos, setRecebimentos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        data: "",
        fonte: "",
        referente: "",
        valor: "",
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchRecebimentos();
    }, []);

    // 🔄 Buscar recebimentos da API
    const fetchRecebimentos = async () => {
        try {
            const response = await axios.get("http://localhost/api/recebimentos", {
                credentials: "include",
            });
            setRecebimentos(response.data);
        } catch (error) {
            console.error("Erro ao buscar recebimentos:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // ✏ Atualizar estado do formulário
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 💾 Salvar ou atualizar recebimento
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.values(formData).some((field) => String(field).trim() === "")) {
            alert("Todos os campos são obrigatórios.");
            return;
        }

        try {
            const url = editingId
                ? `http://localhost/api/recebimentos/${editingId}`
                : "http://localhost/api/recebimentos";
            const method = editingId ? "PUT" : "POST";

            await axios({
                method,
                url,
                data: formData,
                withCredentials: true,
            });

            fetchRecebimentos();
            setFormData({ data: "", fonte: "", referente: "", valor: "" });
            setEditingId(null);
        } catch (error) {
            console.error("Erro ao salvar recebimento:", error);
            alert("Erro ao salvar recebimento.");
        }
    };

    // 📝 Editar recebimento
    const handleEdit = (recebimento) => {
        setFormData({
            data: recebimento.data,
            fonte: recebimento.fonte,
            referente: recebimento.referente,
            valor: recebimento.valor,
        });
        setEditingId(recebimento.id);
    };

    // 🗑 Excluir recebimento
    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este recebimento?")) {
            try {
                await axios.delete(`http://localhost/api/recebimentos/${id}`, {
                    withCredentials: true,
                });
                fetchRecebimentos();
            } catch (error) {
                console.error("Erro ao excluir recebimento:", error);
                alert("Erro ao excluir recebimento.");
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
                <h1 className="text-3xl font-bold">Gerenciamento de Recebimentos</h1>
                <p className="text-gray-300 mt-2">
                    Acompanhe e registre seus recebimentos de forma organizada.
                </p>
            </header>

            {/* Formulário */}
            <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                    {editingId ? "Editar Recebimento" : "Adicionar Recebimento"}
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        name="data"
                        type="date"
                        value={formData.data}
                        onChange={handleInputChange}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        name="fonte"
                        type="text"
                        value={formData.fonte}
                        onChange={handleInputChange}
                        placeholder="Fonte"
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        name="referente"
                        type="text"
                        value={formData.referente}
                        onChange={handleInputChange}
                        placeholder="Referente"
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
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                    >
                        {editingId ? "Atualizar" : "Adicionar"}
                    </button>
                </form>
            </div>

            {/* Tabela de Recebimentos */}
            <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Lista de Recebimentos</h2>
                <table className="w-full border-collapse rounded-lg">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium">Data</th>
                            <th className="px-6 py-3 text-left font-medium">Fonte</th>
                            <th className="px-6 py-3 text-left font-medium">Referente</th>
                            <th className="px-6 py-3 text-right font-medium">Valor</th>
                            <th className="px-6 py-3 text-center font-medium">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recebimentos.map((recebimento) => (
                            <tr key={recebimento.id} className="border-t hover:bg-gray-100 transition">
                                <td className="px-6 py-4">{recebimento.data}</td>
                                <td className="px-6 py-4">{recebimento.fonte}</td>
                                <td className="px-6 py-4">{recebimento.referente}</td>
                                <td className="px-6 py-4 text-right text-green-600 font-medium">
                                    {new Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    }).format(recebimento.valor)}
                                </td>
                                <td className="px-6 py-4 flex justify-center space-x-2">
                                    <button
                                        onClick={() => handleEdit(recebimento)}
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(recebimento.id)}
                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                                    >
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

export default Recebimentos;
