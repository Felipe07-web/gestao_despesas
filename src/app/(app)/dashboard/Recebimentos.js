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
            const url = editingId ? `http://localhost/api/recebimentos/${editingId}` : "http://localhost/api/recebimentos";
            const method = editingId ? "PUT" : "POST";

            await axios({
                method,
                url,
                data: formData,
                withCredentials: true,
            });

            fetchRecebimentos();
            setFormData({
                data: "",
                fonte: "",
                referente: "",
                valor: "",
            });
            setEditingId(null);
        } catch (error) {
            console.error("Erro ao salvar recebimento:", error);
            alert("Erro ao salvar recebimento.");
        }
    };

   
    const handleEdit = (recebimento) => {
        setFormData({
            data: recebimento.data,
            fonte: recebimento.fonte,
            referente: recebimento.referente,
            valor: recebimento.valor,
        });
        setEditingId(recebimento.id);
    };

    
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
        <div className="p-8 bg-white shadow-xl rounded-xl">
            <h1 className="text-3xl font-extrabold mb-6 text-gray-900 tracking-tight">Gerenciamento de Recebimentos</h1>

            <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap gap-4">
                <input name="data" type="date" placeholder="Data" value={formData.data} onChange={handleInputChange} className="border p-2 rounded w-full md:w-1/4" required />
                <input name="fonte" type="text" placeholder="Fonte" value={formData.fonte} onChange={handleInputChange} className="border p-2 rounded w-full md:w-1/4" required />
                <input name="referente" type="text" placeholder="Referente" value={formData.referente} onChange={handleInputChange} className="border p-2 rounded w-full md:w-1/4" required />
                <input name="valor" type="number" step="0.01" placeholder="Valor" value={formData.valor} onChange={handleInputChange} className="border p-2 rounded w-full md:w-1/4" required />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    {editingId ? "Atualizar" : "Adicionar"}
                </button>
            </form>

           
            <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="w-full table-auto">
                    <thead className="bg-gray-50 text-gray-700 uppercase text-sm tracking-wider">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium">Data</th>
                            <th className="px-6 py-3 text-left font-medium">Fonte</th>
                            <th className="px-6 py-3 text-left font-medium">Referente</th>
                            <th className="px-6 py-3 text-right font-medium">Valor</th>
                            <th className="px-6 py-3 text-left font-medium">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recebimentos.map((recebimento, index) => (
                            <tr key={recebimento.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-all duration-200`}>
                                <td className="px-6 py-4 text-gray-700 text-sm">{recebimento.data}</td>
                                <td className="px-6 py-4 text-gray-700">{recebimento.fonte}</td>
                                <td className="px-6 py-4 text-gray-700">{recebimento.referente}</td>
                                <td className="px-6 py-4 text-right font-medium text-green-600">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(recebimento.valor)}
                                </td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button onClick={() => handleEdit(recebimento)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">Editar</button>
                                    <button onClick={() => handleDelete(recebimento.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">Excluir</button>
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
