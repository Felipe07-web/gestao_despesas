import React, { useEffect, useState } from "react";
import axios from "axios";

// ✅ Configuração do Axios para permitir envio de cookies e autenticação
axios.defaults.withCredentials = true;

const Cartoes = () => {
  const [cartoes, setCartoes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    numero: "",
    banco: "",
    limite: "",
    vencimento: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCartoes();
  }, []);

  // ✅ Buscar o token CSRF antes de fazer requisições POST, PUT ou DELETE
  const getCsrfToken = async () => {
    try {
      await axios.get("http://127.0.0.1/sanctum/csrf-cookie");
    } catch (error) {
      console.error("Erro ao obter token CSRF:", error);
    }
  };

  // ✅ Buscar os cartões salvos no backend
  const fetchCartoes = async () => {
    try {
      const response = await fetch("http://127.0.0.1/api/cartoes");
      if (!response.ok) {
        throw new Error(`Erro ao buscar cartões: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();

      const formattedData = data.map(cartao => ({
        ...cartao,
        vencimento: `2025-02-${String(cartao.data_vencimento).padStart(2, "0")}`,
      }));

      setCartoes(formattedData);
    } catch (error) {
      console.error("Erro ao buscar cartões:", error);
      alert("Erro ao buscar cartões. Verifique o console.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Enviar formulário (POST ou PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(formData).some(field => String(field).trim() === "")) {
      alert("Todos os campos são obrigatórios.");
      return;
    }

    try {
      const url = editingId ? `http://127.0.0.1/api/cartoes/${editingId}` : `http://127.0.0.1/api/cartoes`;
      const method = editingId ? "PUT" : "POST";

      const formattedData = {
        cartao: formData.numero,
        banco: formData.banco,
        limite: parseFloat(formData.limite),
        bandeira: "Visa",
        data_vencimento: parseInt(formData.vencimento.split("-")[2]),
      };

      console.log("🔹 Enviando requisição para:", url);
      console.log("📦 Dados enviados:", formattedData);

      await getCsrfToken(); // ✅ Obtém o token CSRF antes da requisição

      const response = await fetch(url, {
        method: method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        throw new Error(`Erro ao salvar cartão: ${response.status} ${response.statusText}`);
      }

      fetchCartoes();
      setFormData({ numero: "", banco: "", limite: "", vencimento: "" });
      setEditingId(null);
      alert("Cartão salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert(`Erro ao salvar o cartão: ${error.message}`);
    }
  };

  const handleEdit = (cartao) => {
    setFormData({
      numero: cartao.cartao,
      banco: cartao.banco,
      limite: cartao.limite,
      vencimento: cartao.vencimento,
    });
    setEditingId(cartao.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este cartão?")) {
      try {
        await getCsrfToken(); // ✅ Obtém o token CSRF antes da requisição

        const response = await fetch(`http://127.0.0.1/api/cartoes/${id}`, {
          method: "DELETE",
          credentials: "include",
          headers: { "Accept": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Erro ao excluir cartão: ${response.status} ${response.statusText}`);
        }

        fetchCartoes();
        alert("Cartão excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir:", error);
        alert(`Erro ao excluir o cartão: ${error.message}`);
      }
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Carregando...</div>;
  }

  return (
    <div className="p-8 bg-white shadow-xl rounded-xl">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-900 tracking-tight">Gestão de Cartões</h1>

      <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap gap-4">
        <input name="numero" type="text" value={formData.numero} onChange={handleInputChange} placeholder="Número do Cartão" className="border p-2 rounded w-full md:w-1/4" required />
        <input name="banco" type="text" value={formData.banco} onChange={handleInputChange} placeholder="Banco" className="border p-2 rounded w-full md:w-1/4" required />
        <input name="limite" type="number" step="0.01" value={formData.limite} onChange={handleInputChange} placeholder="Limite" className="border p-2 rounded w-full md:w-1/4" required />
        <input name="vencimento" type="date" value={formData.vencimento} onChange={handleInputChange} className="border p-2 rounded w-full md:w-1/4" required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          {editingId ? "Atualizar" : "Adicionar"}
        </button>
      </form>

      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <table className="w-full table-auto">
          <thead className="bg-gray-50 text-gray-700 uppercase text-sm tracking-wider">
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
              <tr key={cartao.id} className="hover:bg-gray-100 transition-all duration-200">
                <td className="px-6 py-4 text-gray-800">{cartao.cartao}</td>
                <td className="px-6 py-4 text-gray-700">{cartao.banco}</td>
                <td className="px-6 py-4 text-right font-medium text-green-600">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cartao.limite)}
                </td>
                <td className="px-6 py-4 text-center text-gray-700">
                  {cartao.vencimento.split("-").reverse().join("/")}
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button onClick={() => handleEdit(cartao)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">Editar</button>
                  <button onClick={() => handleDelete(cartao.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">Excluir</button>
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
