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

    // 🔹 Função para buscar todas as empresas (GET)
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

    // 🔹 Atualiza os valores do formulário
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 🔹 Criar ou Editar uma empresa (POST/PUT)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.empresa || !formData.nome || !formData.tipo_contrato) {
            alert("Todos os campos são obrigatórios.");
            return;
        }

        try {
            const url = editingId ? `http://localhost/api/empresas/${editingId}` : "http://localhost/api/empresas";
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

    // 🔹 Preenche o formulário ao editar
    const handleEdit = (empresa) => {
        setFormData({
            empresa: empresa.empresa,
            nome: empresa.nome,
            tipo_contrato: empresa.tipo_contrato,
        });
        setEditingId(empresa.id);
    };

    // 🔹 Excluir empresa (DELETE)
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
        <div className="p-8 bg-white shadow-xl rounded-xl">
            <h1 className="text-3xl font-extrabold mb-6 text-gray-900 tracking-tight">Empresas</h1>

            {/* Formulário de Cadastro/Edição */}
            <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap gap-4">
                <input
                    name="empresa"
                    type="text"
                    placeholder="Empresa"
                    value={formData.empresa}
                    onChange={handleInputChange}
                    className="border p-2 rounded w-full md:w-1/3"
                    required
                />
                <input
                    name="nome"
                    type="text"
                    placeholder="Nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    className="border p-2 rounded w-full md:w-1/3"
                    required
                />
                <input
                    name="tipo_contrato"
                    type="text"
                    placeholder="Tipo de Contrato"
                    value={formData.tipo_contrato}
                    onChange={handleInputChange}
                    className="border p-2 rounded w-full md:w-1/3"
                    required
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    {editingId ? "Atualizar" : "Adicionar"}
                </button>
            </form>

            {/* Tabela de Empresas */}
            <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="w-full table-auto">
                    <thead className="bg-gray-50 text-gray-700 uppercase text-sm tracking-wider">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium">Empresa</th>
                            <th className="px-6 py-3 text-left font-medium">Nome</th>
                            <th className="px-6 py-3 text-left font-medium">Tipo de Contrato</th>
                            <th className="px-6 py-3 text-left font-medium">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {empresas.map((empresa, index) => (
                            <tr
                                key={empresa.id}
                                className={`${
                                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                } hover:bg-gray-100 transition-all duration-200`}
                            >
                                <td className="px-6 py-4 text-gray-800">{empresa.empresa}</td>
                                <td className="px-6 py-4 text-gray-700">{empresa.nome}</td>
                                <td className="px-6 py-4 text-gray-700">{empresa.tipo_contrato}</td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button
                                        onClick={() => handleEdit(empresa)}
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(empresa.id)}
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

export default Empresas;
