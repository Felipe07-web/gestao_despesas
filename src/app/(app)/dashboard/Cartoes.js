import React, { useEffect, useState } from "react";
import axios from "axios";

// ✅ Configurar Axios globalmente
axios.defaults.withCredentials = true; // 🔹 Permite cookies e autenticação
axios.defaults.baseURL = process.env.REACT_APP_API_URL || "http://127.0.0.1/api"; // 🔹 Define URL base
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

  // ✅ Buscar CSRF antes de enviar requisições protegidas
  const getCsrfToken = async () => {
    try {
      await axios.get("/sanctum/csrf-cookie");
    } catch (error) {
      console.error("❌ Erro ao obter token CSRF:", error);
    }
  };

  // ✅ Buscar cartões do backend
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

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Enviar formulário (POST ou PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(formData).some((field) => String(field).trim() === "")) {
      alert("Todos os campos são obrigatórios.");
      return;
    }

    try {
      await getCsrfToken(); // 🔹 Obtém CSRF antes da requisição

      const url = editingId ? `/cartoes/${editingId}` : `/cartoes`;
      const method = editingId ? "put" : "post";

      const formattedData = {
        cartao: formData.cartao,
        banco: formData.banco,
        limite: parseFloat(formData.limite),
        bandeira: "Visa",
        data_vencimento: formData.vencimento,
      };

      console.log("🔹 Enviando requisição para:", axios.defaults.baseURL + url);
      console.log("📦 Dados enviados:", formattedData);

      const response = await axios({
        method,
        url,
        data: formattedData,
      });

      console.log("✅ Resposta do servidor:", response.data);

      fetchCartoes();
      setFormData({ cartao: "", banco: "", limite: "", vencimento: "" });
      setEditingId(null);
      alert("Cartão salvo com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao salvar cartão:", error);
      alert(`Erro ao salvar cartão: ${error.message}`);
    }
  };

  const handleEdit = (cartao) => {
    setFormData({
      cartao: cartao.cartao,
      banco: cartao.banco,
      limite: cartao.limite,
      vencimento: cartao.data_vencimento,
    });
    setEditingId(cartao.id);
  };

  
  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este cartão?")) {
      try {
        await getCsrfToken(); // 🔹 Obtém CSRF antes da requisição

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
    <div className="p-8 bg-white shadow-xl rounded-xl">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-900 tracking-tight">Gestão de Cartões</h1>

      <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap gap-4">
        <input name="cartao" type="text" value={formData.cartao} onChange={handleInputChange} placeholder="Número do Cartão" className="border p-2 rounded w-full md:w-1/4" required />
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
                <td className="px-6 py-4 text-center text-gray-700">{cartao.data_vencimento}</td>
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
