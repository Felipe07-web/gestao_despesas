"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

const Gastos = () => {
    const [gastos, setGastos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        subtipo_2: "",
        data: "",
        gasto: "",
        valor: "",
        parcelas: "",
        cartao: "",
        vencimento_boleto: "",
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchGastos();
    }, []);

    // 🔄 Buscar gastos da API
    const fetchGastos = async () => {
        try {
            const response = await axios.get("http://localhost/api/gastos", {
                credentials: "include",
            });
            setGastos(response.data);
        } catch (error) {
            console.error("Erro ao buscar gastos:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // ✏ Atualizar estado do formulário
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 💾 Salvar ou atualizar gasto
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.values(formData).some((field) => String(field).trim() === "")) {
            alert("Todos os campos são obrigatórios.");
            return;
        }

        try {
            const url = editingId
                ? `http://localhost/api/gastos/${editingId}`
                : "http://localhost/api/gastos";
            const method = editingId ? "PUT" : "POST";

            await axios({
                method,
                url,
                data: formData,
                withCredentials: true,
            });

            fetchGastos();
            setFormData({
                subtipo_2: "",
                data: "",
                gasto: "",
                valor: "",
                parcelas: "",
                cartao: "",
                vencimento_boleto: "",
            });
            setEditingId(null);
        } catch (error) {
            console.error("Erro ao salvar gasto:", error);
            alert("Erro ao salvar gasto.");
        }
    };

    // 📝 Editar gasto
    const handleEdit = (gasto) => {
        setFormData({
            subtipo_2: gasto.subtipo_2,
            data: gasto.data,
            gasto: gasto.gasto,
            valor: gasto.valor,
            parcelas: gasto.parcelas,
            cartao: gasto.cartao,
            vencimento_boleto: gasto.vencimento_boleto,
        });
        setEditingId(gasto.id);
    };

    // 🗑 Excluir gasto
    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este gasto?")) {
            try {
                await axios.delete(`http://localhost/api/gastos/${id}`, {
                    withCredentials: true,
                });
                fetchGastos();
            } catch (error) {
                console.error("Erro ao excluir gasto:", error);
                alert("Erro ao excluir gasto.");
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
                <h1 className="text-3xl font-bold">Gerenciamento de Gastos</h1>
                <p className="text-gray-300 mt-2">
                    Acompanhe e registre seus gastos de forma organizada.
                </p>
            </header>

            {/* Formulário */}
            <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                    {editingId ? "Editar Gasto" : "Adicionar Gasto"}
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
                        name="data"
                        type="date"
                        value={formData.data}
                        onChange={handleInputChange}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        name="gasto"
                        type="text"
                        value={formData.gasto}
                        onChange={handleInputChange}
                        placeholder="Gasto"
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
                        name="parcelas"
                        type="number"
                        value={formData.parcelas}
                        onChange={handleInputChange}
                        placeholder="Parcelas"
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        name="cartao"
                        type="text"
                        value={formData.cartao}
                        onChange={handleInputChange}
                        placeholder="Cartão"
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        name="vencimento_boleto"
                        type="date"
                        value={formData.vencimento_boleto}
                        onChange={handleInputChange}
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

            {/* Tabela de Gastos */}
            <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Lista de Gastos</h2>
                <table className="w-full border-collapse rounded-lg">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium">Subtipo 2</th>
                            <th className="px-4 py-3 text-center font-medium">Data</th>
                            <th className="px-6 py-3 text-left font-medium">Gasto</th>
                            <th className="px-6 py-3 text-right font-medium">Valor</th>
                            <th className="px-4 py-3 text-center font-medium">Parcelas</th>
                            <th className="px-6 py-3 text-left font-medium">Cartão</th>
                            <th className="px-4 py-3 text-center font-medium">Vencimento</th>
                            <th className="px-6 py-3 text-left font-medium">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gastos.map((gasto) => (
                            <tr key={gasto.id} className="border-t hover:bg-gray-100 transition">
                                <td className="px-6 py-4">{gasto.subtipo_2}</td>
                                <td className="px-4 py-4 text-center">{gasto.data}</td>
                                <td className="px-6 py-4">{gasto.gasto}</td>
                                <td className="px-6 py-4 text-right text-red-500 font-medium">
                                    {new Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    }).format(gasto.valor)}
                                </td>
                                <td className="px-4 py-4 text-center">{gasto.parcelas}</td>
                                <td className="px-6 py-4">{gasto.cartao}</td>
                                <td className="px-4 py-4 text-center">{gasto.vencimento_boleto}</td>
                                <td className="px-6 py-4 flex justify-center space-x-2">
                                    <button onClick={() => handleEdit(gasto)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">
                                        Editar
                                    </button>
                                    <button onClick={() => handleDelete(gasto.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">
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

export default Gastos;
