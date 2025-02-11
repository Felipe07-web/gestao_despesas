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

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

   
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            await axios.get("http://127.0.0.1/sanctum/csrf-cookie"); // 🔹 CSRF obrigatório se estiver autenticado
    
            const url = editingId ? `http://127.0.0.1/api/contratos/${editingId}` : `http://127.0.0.1/api/contratos`;
            const method = editingId ? "PUT" : "POST";
    
            const formattedData = {
                contrato: formData.contrato,
                empresa: formData.empresa,
                horas_medias: parseFloat(formData.horas_medias),
                salario: parseFloat(formData.salario),
                descontos: formData.descontos ? parseFloat(formData.descontos) : 0,
                beneficio: formData.beneficio ? parseFloat(formData.beneficio) : 0,
            };
    
            console.log("🔹 Enviando requisição para:", url);
            console.log("📦 Dados enviados:", formattedData);
    
            const response = await axios({
                method,
                url,
                data: formattedData,
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            });
    
            console.log("✅ Contrato salvo com sucesso:", response.data);
            alert("Contrato cadastrado!");
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
            if (error.response) {
                console.error("❌ Erro ao salvar contrato:", error.response.data);
                alert(`Erro ao salvar contrato: ${JSON.stringify(error.response.data.errors)}`);
            } else {
                console.error("❌ Erro ao salvar contrato:", error);
                alert("Erro desconhecido ao salvar contrato.");
            }
        }
    };
    
    
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

    // 🔹 Excluir contrato (DELETE)
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
        <div className="p-8 bg-white shadow-xl rounded-xl">
            <h1 className="text-3xl font-extrabold mb-6 text-gray-900 tracking-tight">Gerenciamento de Contratos</h1>

            {/* Formulário de Cadastro/Edição */}
            <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap gap-4">
                <input name="contrato" type="text" placeholder="Número do Contrato" value={formData.contrato} onChange={handleInputChange} className="border p-2 rounded w-full md:w-1/4" required />
                <input name="empresa" type="text" placeholder="Empresa" value={formData.empresa} onChange={handleInputChange} className="border p-2 rounded w-full md:w-1/4" required />
                <input name="horas_medias" type="number" placeholder="Horas Médias" value={formData.horas_medias} onChange={handleInputChange} className="border p-2 rounded w-full md:w-1/4" required />
                <input name="salario" type="number" step="0.01" placeholder="Salário" value={formData.salario} onChange={handleInputChange} className="border p-2 rounded w-full md:w-1/4" required />
                <input name="descontos" type="number" step="0.01" placeholder="Descontos" value={formData.descontos} onChange={handleInputChange} className="border p-2 rounded w-full md:w-1/4" required />
                <input name="beneficio" type="number" step="0.01" placeholder="Benefício" value={formData.beneficio} onChange={handleInputChange} className="border p-2 rounded w-full md:w-1/4" required />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    {editingId ? "Atualizar" : "Adicionar"}
                </button>
            </form>

            {/* Tabela de Contratos */}
            <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="w-full table-auto">
                    <thead className="bg-gray-50 text-gray-700 uppercase text-sm tracking-wider">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium">Contrato</th>
                            <th className="px-6 py-3 text-left font-medium">Empresa</th>
                            <th className="px-6 py-3 text-left font-medium">Horas Médias</th>
                            <th className="px-6 py-3 text-left font-medium">Salário</th>
                            <th className="px-6 py-3 text-left font-medium">Descontos</th>
                            <th className="px-6 py-3 text-left font-medium">Benefício</th>
                            <th className="px-6 py-3 text-left font-medium">Ações</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {contratos.map((contrato, index) => (
                            <tr key={contrato.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-all duration-200`}>
                                <td className="px-6 py-4 text-gray-800">{contrato.contrato}</td>
                                <td className="px-6 py-4 text-gray-700">{contrato.empresa}</td>
                                <td className="px-6 py-4 text-gray-700">{contrato.horas_medias}</td>
                                <td className="px-6 py-4 text-gray-700">{contrato.salario}</td>
                                <td className="px-6 py-4 text-gray-700">{contrato.descontos}</td>
                                <td className="px-6 py-4 text-gray-700">{contrato.beneficio}</td>
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
