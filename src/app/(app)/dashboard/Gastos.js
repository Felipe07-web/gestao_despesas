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
            const url = editingId ? `http://localhost/api/gastos/${editingId}` : "http://localhost/api/gastos";
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
        <div className="p-8 bg-white shadow-xl rounded-xl">
            <h1 className="text-3xl font-extrabold mb-6 text-gray-900 tracking-tight">Gerenciamento de Gastos</h1>

          
            <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap gap-4">
                <input name="subtipo_2" type="text" placeholder="Subtipo 2" value={formData.subtipo_2} onChange={handleInputChange} className="border p-2 rounded w-full md:w-1/4" required />
                <input name="data" type="date" placeholder="Data" value={formData.data} onChange={handleInputChange} className="border p-2 rounded w-full md:w-1/4" required />
                <input name="gasto" type="text" placeholder="Gasto" value={formData.gasto} onChange={handleInputChange} className="border p-2 rounded w-full md:w-1/4" required />
                <input name="valor" type="number" step="0.01" placeholder="Valor" value={formData.valor} onChange={handleInputChange} className="border p-2 rounded w-full md:w-1/4" required />
                <input name="parcelas" type="number" placeholder="Parcelas" value={formData.parcelas} onChange={handleInputChange} className="border p-2 rounded w-full md:w-1/4" required />
                <input name="cartao" type="text" placeholder="Cartão" value={formData.cartao} onChange={handleInputChange} className="border p-2 rounded w-full md:w-1/4" required />
                <input name="vencimento_boleto" type="date" placeholder="Vencimento" value={formData.vencimento_boleto} onChange={handleInputChange} className="border p-2 rounded w-full md:w-1/4" required />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    {editingId ? "Atualizar" : "Adicionar"}
                </button>
            </form>

         
            <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="w-full table-auto">
                    <thead className="bg-gray-50 text-gray-700 uppercase text-sm tracking-wider">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium">Subtipo 2</th>
                            <th className="px-4 py-3 text-center font-medium w-28">Data</th>
                            <th className="px-6 py-3 text-left font-medium">Gasto</th>
                            <th className="px-6 py-3 text-right font-medium">Valor</th>
                            <th className="px-4 py-3 text-center font-medium w-20">Parcelas</th>
                            <th className="px-6 py-3 text-left font-medium">Cartão</th>
                            <th className="px-4 py-3 text-center font-medium w-32">Vencimento</th>
                            <th className="px-6 py-3 text-left font-medium">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gastos.map((gasto, index) => (
                            <tr key={gasto.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-all duration-200`}>
                                <td className="px-6 py-4 text-gray-800">{gasto.subtipo_2}</td>
                                <td className="px-4 py-4 text-center text-gray-700 text-sm">{gasto.data}</td>
                                <td className="px-6 py-4 text-gray-700">{gasto.gasto}</td>
                                <td className="px-6 py-4 text-right font-medium text-red-500">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(gasto.valor)}
                                </td>
                                <td className="px-4 py-4 text-center text-gray-700 text-sm">{gasto.parcelas}</td>
                                <td className="px-6 py-4 text-gray-700">{gasto.cartao}</td>
                                <td className="px-4 py-4 text-center text-gray-700 text-sm">{gasto.vencimento_boleto}</td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button onClick={() => handleEdit(gasto)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">Editar</button>
                                    <button onClick={() => handleDelete(gasto.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">Excluir</button>
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
