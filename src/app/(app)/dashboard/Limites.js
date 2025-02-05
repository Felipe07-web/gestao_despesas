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

    
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

   
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.values(formData).some((field) => String(field).trim() === "")) {
            alert("Todos os campos são obrigatórios.");
            return;
        }

        try {
            const url = editingId ? `http://localhost/api/limites/${editingId}` : "http://localhost/api/limites";
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


    const handleEdit = (limite) => {
        setFormData({
            subtipo_2: limite.subtipo_2,
            valor: limite.valor,
            periodicidade: limite.periodicidade,
            numero_meses: limite.numero_meses,
        });
        setEditingId(limite.id);
    };

   
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
        <div className="p-8 bg-white shadow-xl rounded-xl">
            <h1 className="text-3xl font-extrabold mb-6 text-gray-900 tracking-tight">Gerenciamento de Limites</h1>

            {/* Formulário de Cadastro/Edição */}
            <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap gap-4">
                <input name="subtipo_2" type="text" placeholder="Subtipo 2" value={formData.subtipo_2} onChange={handleInputChange} className="border p-2 rounded w-full md:w-1/4" required />
                <input name="valor" type="number" step="0.01" placeholder="Valor" value={formData.valor} onChange={handleInputChange} className="border p-2 rounded w-full md:w-1/4" required />
                <input name="periodicidade" type="text" placeholder="Periodicidade" value={formData.periodicidade} onChange={handleInputChange} className="border p-2 rounded w-full md:w-1/4" required />
                <input name="numero_meses" type="number" placeholder="Meses" value={formData.numero_meses} onChange={handleInputChange} className="border p-2 rounded w-full md:w-1/4" required />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    {editingId ? "Atualizar" : "Adicionar"}
                </button>
            </form>

            {/* Tabela de Limites */}
            <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="w-full table-auto">
                    <thead className="bg-gray-50 text-gray-700 uppercase text-sm tracking-wider">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium">Subtipo 2</th>
                            <th className="px-6 py-3 text-right font-medium">Valor</th>
                            <th className="px-4 py-3 text-center font-medium w-32">Periodicidade</th>
                            <th className="px-4 py-3 text-center font-medium w-28">Meses</th>
                            <th className="px-6 py-3 text-left font-medium">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {limites.map((limite, index) => (
                            <tr key={limite.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-all duration-200`}>
                                <td className="px-6 py-4 text-gray-800">{limite.subtipo_2}</td>
                                <td className="px-6 py-4 text-right font-medium text-green-600">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(limite.valor)}
                                </td>
                                <td className="px-4 py-4 text-center text-gray-700 text-sm">{limite.periodicidade}</td>
                                <td className="px-4 py-4 text-center text-gray-700 text-sm">{limite.numero_meses}</td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button onClick={() => handleEdit(limite)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">Editar</button>
                                    <button onClick={() => handleDelete(limite.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">Excluir</button>
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
