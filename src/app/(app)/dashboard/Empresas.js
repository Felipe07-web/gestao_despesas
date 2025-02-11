"use client";

import React, { useEffect, useState } from "react";

const Empresas = () => {
    const [empresas, setEmpresas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        empresa: "",
        nome: "",
        tipo_contrato: "",
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchEmpresas();
    }, []);

    // 🔄 Buscar empresas da API
    const fetchEmpresas = async () => {
        try {
            const response = await fetch("http://localhost/api/empresas", {
                credentials: "include",
            });
            const data = await response.json();
            setEmpresas(data);
        } catch (error) {
            console.error("Erro ao buscar empresas:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // ✏ Atualizar estado do formulário
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 💾 Salvar ou atualizar empresa
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.empresa || !formData.nome || !formData.tipo_contrato) {
            alert("Todos os campos são obrigatórios.");
            return;
        }

        try {
            const url = editingId
                ? `http://localhost/api/empresas/${editingId}`
                : "http://localhost/api/empresas";
            const method = editingId ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Erro ao salvar a empresa.");

            fetchEmpresas();
            setFormData({ empresa: "", nome: "", tipo_contrato: "" });
            setEditingId(null);
        } catch (error) {
            console.error("Erro ao salvar empresa:", error);
            alert("Erro ao salvar empresa.");
        }
    };

    // 📝 Editar empresa
    const handleEdit = (empresa) => {
        setFormData({
            empresa: empresa.empresa,
            nome: empresa.nome,
            tipo_contrato: empresa.tipo_contrato,
        });
        setEditingId(empresa.id);
    };

    // 🗑 Excluir empresa
    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir esta empresa?")) {
            try {
                const response = await fetch(`http://localhost/api/empresas/${id}`, {
                    method: "DELETE",
                    credentials: "include",
                });

                if (!response.ok) throw new Error("Erro ao excluir empresa.");

                fetchEmpresas();
            } catch (error) {
                console.error("Erro ao excluir empresa:", error);
                alert("Erro ao excluir empresa.");
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
                <h1 className="text-3xl font-bold">Gerenciamento de Empresas</h1>
                <p className="text-gray-300 mt-2">
                    Adicione, edite e gerencie empresas cadastradas no sistema.
                </p>
            </header>

            {/* Formulário */}
            <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                    {editingId ? "Editar Empresa" : "Adicionar Empresa"}
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        name="empresa"
                        type="text"
                        value={formData.empresa}
                        onChange={handleInputChange}
                        placeholder="Empresa"
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        name="nome"
                        type="text"
                        value={formData.nome}
                        onChange={handleInputChange}
                        placeholder="Nome"
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        name="tipo_contrato"
                        type="text"
                        value={formData.tipo_contrato}
                        onChange={handleInputChange}
                        placeholder="Tipo de Contrato"
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

            {/* Tabela de Empresas */}
            <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Lista de Empresas</h2>
                <table className="w-full border-collapse rounded-lg">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium">Empresa</th>
                            <th className="px-6 py-3 text-left font-medium">Nome</th>
                            <th className="px-6 py-3 text-left font-medium">Tipo de Contrato</th>
                            <th className="px-6 py-3 text-left font-medium">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {empresas.map((empresa) => (
                            <tr key={empresa.id} className="border-t hover:bg-gray-100 transition">
                                <td className="px-6 py-4">{empresa.empresa}</td>
                                <td className="px-6 py-4">{empresa.nome}</td>
                                <td className="px-6 py-4">{empresa.tipo_contrato}</td>
                                <td className="px-6 py-4 flex justify-center space-x-2">
                                    <button onClick={() => handleEdit(empresa)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">
                                        Editar
                                    </button>
                                    <button onClick={() => handleDelete(empresa.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">
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

export default Empresas;
