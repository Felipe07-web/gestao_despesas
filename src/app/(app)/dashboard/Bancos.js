"use client";

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

    // 🔄 Buscar bancos da API
    const fetchBancos = async () => {
        try {
            const response = await fetch("http://127.0.0.1/api/bancos", {
                credentials: "include",
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

    // ✏ Atualizar estado do formulário
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 💾 Salvar ou atualizar banco
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.values(formData).some((field) => field === "")) {
            alert("Todos os campos são obrigatórios.");
            return;
        }

        try {
            const url = editingId
                ? `http://127.0.0.1/api/bancos/${editingId}`
                : `http://127.0.0.1/api/bancos`;
            const method = editingId ? "PUT" : "POST";

            const formattedData = {
                ...formData,
                data: new Date(formData.data).toISOString().split("T")[0],
            };

            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formattedData),
            });

            if (!response.ok) throw new Error("Erro ao salvar o banco");

            fetchBancos();
            setFormData({ data: "", banco: "", referente: "", valor: "" });
            setEditingId(null);
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert(`Erro ao salvar: ${error.message}`);
        }
    };

    // 📝 Editar banco
    const handleEdit = (banco) => {
        setFormData({
            data: banco.data,
            banco: banco.banco,
            referente: banco.referente,
            valor: banco.valor,
        });
        setEditingId(banco.id);
    };

    // 🗑 Excluir banco
    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este banco?")) {
            try {
                const response = await fetch(`http://127.0.0.1/api/bancos/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) throw new Error("Erro ao excluir banco");

                fetchBancos();
            } catch (error) {
                console.error("Erro ao excluir:", error);
                alert(`Erro ao excluir: ${error.message}`);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            {/* Cabeçalho */}
            <header className="bg-blue-900 text-white p-6 rounded-lg shadow-lg text-center">
                <h1 className="text-3xl font-bold">Gestão de Bancos</h1>
                <p className="text-gray-300 mt-2">
                    Gerencie suas contas bancárias e controle suas finanças com facilidade.
                </p>
            </header>

            {/* Formulário */}
            <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                    {editingId ? "Editar Banco" : "Adicionar Banco"}
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
                        name="banco"
                        type="text"
                        value={formData.banco}
                        onChange={handleInputChange}
                        placeholder="Banco"
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

            {/* Tabela de Bancos */}
            <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Lista de Bancos</h2>
                <table className="w-full border-collapse rounded-lg">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium">Data</th>
                            <th className="px-6 py-3 text-left font-medium">Banco</th>
                            <th className="px-6 py-3 text-left font-medium">Referente</th>
                            <th className="px-6 py-3 text-right font-medium">Valor</th>
                            <th className="px-6 py-3 text-center font-medium">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bancos.map((banco) => (
                            <tr key={banco.id} className="border-t hover:bg-gray-100 transition">
                                <td className="px-6 py-4">{banco.data}</td>
                                <td className="px-6 py-4">{banco.banco}</td>
                                <td className="px-6 py-4">{banco.referente}</td>
                                <td className="px-6 py-4 text-right text-green-600 font-medium">
                                    {new Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    }).format(banco.valor)}
                                </td>
                                <td className="px-6 py-4 flex justify-center space-x-2">
                                    <button
                                        onClick={() => handleEdit(banco)}
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(banco.id)}
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

export default Bancos;
