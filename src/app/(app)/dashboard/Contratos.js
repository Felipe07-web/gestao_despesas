"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

const Contratos = () => {
    const [contratos, setContratos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        contrato: "",
        empresa: "",
        horas_medias: "",
        salario: "",
        descontos: "",
        beneficio: "",
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchContratos();
    }, []);

    // 🔄 Buscar contratos da API
    const fetchContratos = async () => {
        try {
            const response = await axios.get("http://localhost/api/contratos", {
                credentials: "include",
            });
            setContratos(response.data);
        } catch (error) {
            console.error("Erro ao buscar contratos:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // ✏ Atualizar estado do formulário
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 💾 Salvar ou atualizar contrato
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.get("http://127.0.0.1/sanctum/csrf-cookie");

            const url = editingId
                ? `http://127.0.0.1/api/contratos/${editingId}`
                : `http://127.0.0.1/api/contratos`;
            const method = editingId ? "PUT" : "POST";

            const formattedData = {
                contrato: formData.contrato,
                empresa: formData.empresa,
                horas_medias: parseFloat(formData.horas_medias),
                salario: parseFloat(formData.salario),
                descontos: formData.descontos ? parseFloat(formData.descontos) : 0,
                beneficio: formData.beneficio ? parseFloat(formData.beneficio) : 0,
            };

            await axios({
                method,
                url,
                data: formattedData,
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            });

            fetchContratos();
            setFormData({
                contrato: "",
                empresa: "",
                horas_medias: "",
                salario: "",
                descontos: "",
                beneficio: "",
            });
            setEditingId(null);
        } catch (error) {
            console.error("Erro ao salvar contrato:", error);
            alert("Erro ao salvar contrato.");
        }
    };

    // 📝 Editar contrato
    const handleEdit = (contrato) => {
        setFormData({
            contrato: contrato.contrato,
            empresa: contrato.empresa,
            horas_medias: contrato.horas_medias,
            salario: contrato.salario,
            descontos: contrato.descontos,
            beneficio: contrato.beneficio,
        });
        setEditingId(contrato.id);
    };

    // 🗑 Excluir contrato
    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este contrato?")) {
            try {
                await axios.delete(`http://localhost/api/contratos/${id}`, {
                    withCredentials: true,
                });
                fetchContratos();
            } catch (error) {
                console.error("Erro ao excluir contrato:", error);
                alert("Erro ao excluir contrato.");
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
                <h1 className="text-3xl font-bold">Gerenciamento de Contratos</h1>
                <p className="text-gray-300 mt-2">
                    Controle os contratos da empresa de forma eficiente.
                </p>
            </header>

            {/* Formulário */}
            <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                    {editingId ? "Editar Contrato" : "Adicionar Contrato"}
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        name="contrato"
                        type="text"
                        value={formData.contrato}
                        onChange={handleInputChange}
                        placeholder="Número do Contrato"
                        className="border p-2 rounded"
                        required
                    />
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
                        name="horas_medias"
                        type="number"
                        value={formData.horas_medias}
                        onChange={handleInputChange}
                        placeholder="Horas Médias"
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        name="salario"
                        type="number"
                        step="0.01"
                        value={formData.salario}
                        onChange={handleInputChange}
                        placeholder="Salário"
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        name="descontos"
                        type="number"
                        step="0.01"
                        value={formData.descontos}
                        onChange={handleInputChange}
                        placeholder="Descontos"
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        name="beneficio"
                        type="number"
                        step="0.01"
                        value={formData.beneficio}
                        onChange={handleInputChange}
                        placeholder="Benefício"
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

            {/* Tabela de Contratos */}
            <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Lista de Contratos</h2>
                <table className="w-full border-collapse rounded-lg">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium">Contrato</th>
                            <th className="px-6 py-3 text-left font-medium">Empresa</th>
                            <th className="px-6 py-3 text-left font-medium">Horas Médias</th>
                            <th className="px-6 py-3 text-right font-medium">Salário</th>
                            <th className="px-6 py-3 text-right font-medium">Descontos</th>
                            <th className="px-6 py-3 text-right font-medium">Benefício</th>
                            <th className="px-6 py-3 text-left font-medium">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contratos.map((contrato) => (
                            <tr key={contrato.id} className="border-t hover:bg-gray-100 transition">
                                <td className="px-6 py-4">{contrato.contrato}</td>
                                <td className="px-6 py-4">{contrato.empresa}</td>
                                <td className="px-6 py-4">{contrato.horas_medias}</td>
                                <td className="px-6 py-4 text-right">{contrato.salario}</td>
                                <td className="px-6 py-4 text-right">{contrato.descontos}</td>
                                <td className="px-6 py-4 text-right">{contrato.beneficio}</td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button onClick={() => handleEdit(contrato)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">Editar</button>
                                    <button onClick={() => handleDelete(contrato.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Contratos;
