"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

// ✅ Configuração Global do Axios
axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.REACT_APP_API_URL || "http://127.0.0.1/api";
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";

const Cartoes = () => {
  const [cartoes, setCartoes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    cartao: "",
    banco: "",
    limite: "",
    vencimento: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCartoes();
  }, []);

  // 🔄 Buscar Cartões
  const fetchCartoes = async () => {
    try {
      const response = await axios.get("/cartoes");
      setCartoes(response.data);
    } catch (error) {
      console.error("❌ Erro ao buscar cartões:", error);
      alert("Erro ao buscar cartões.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✏ Atualizar estado do formulário
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 💾 Enviar formulário (Salvar ou Atualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(formData).some((field) => String(field).trim() === "")) {
      alert("Todos os campos são obrigatórios.");
      return;
    }

    try {
      const url = editingId ? `/cartoes/${editingId}` : `/cartoes`;
      const method = editingId ? "put" : "post";

      const formattedData = {
        cartao: formData.cartao,
        banco: formData.banco,
        limite: parseFloat(formData.limite),
        bandeira: "Visa",
        data_vencimento: formData.vencimento,
      };

      await axios({ method, url, data: formattedData });

      fetchCartoes();
      setFormData({ cartao: "", banco: "", limite: "", vencimento: "" });
      setEditingId(null);
      alert("Cartão salvo com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao salvar cartão:", error);
      alert(`Erro ao salvar cartão: ${error.message}`);
    }
  };

  // 📝 Editar Cartão
  const handleEdit = (cartao) => {
    setFormData({
      cartao: cartao.cartao,
      banco: cartao.banco,
      limite: cartao.limite,
      vencimento: cartao.data_vencimento,
    });
    setEditingId(cartao.id);
  };

  // 🗑 Excluir Cartão
  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este cartão?")) {
      try {
        await axios.delete(`/cartoes/${id}`);
        fetchCartoes();
        alert("Cartão excluído com sucesso!");
      } catch (error) {
        console.error("❌ Erro ao excluir cartão:", error);
        alert(`Erro ao excluir o cartão: ${error.message}`);
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
        <h1 className="text-3xl font-bold">Gestão de Cartões</h1>
        <p className="text-gray-300 mt-2">Gerencie seus cartões e controle seus gastos.</p>
      </header>

      {/* Formulário */}
      <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          {editingId ? "Editar Cartão" : "Adicionar Cartão"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            name="cartao"
            type="text"
            value={formData.cartao}
            onChange={handleInputChange}
            placeholder="Número do Cartão"
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
            name="limite"
            type="number"
            step="0.01"
            value={formData.limite}
            onChange={handleInputChange}
            placeholder="Limite"
            className="border p-2 rounded"
            required
          />
          <input
            name="vencimento"
            type="date"
            value={formData.vencimento}
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

      {/* Tabela de Cartões */}
      <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Lista de Cartões</h2>
        <table className="w-full border-collapse rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left font-medium">Número</th>
              <th className="px-6 py-3 text-left font-medium">Banco</th>
              <th className="px-6 py-3 text-right font-medium">Limite</th>
              <th className="px-6 py-3 text-center font-medium">Vencimento</th>
              <th className="px-6 py-3 text-left font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {cartoes.map((cartao) => (
              <tr key={cartao.id} className="border-t hover:bg-gray-100 transition">
                <td className="px-6 py-4">{cartao.cartao}</td>
                <td className="px-6 py-4">{cartao.banco}</td>
                <td className="px-6 py-4 text-right text-green-600 font-medium">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(cartao.limite)}
                </td>
                <td className="px-6 py-4 text-center">{cartao.data_vencimento}</td>
                <td className="px-6 py-4 flex justify-center space-x-2">
                  <button onClick={() => handleEdit(cartao)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(cartao.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">
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

export default Cartoes;
