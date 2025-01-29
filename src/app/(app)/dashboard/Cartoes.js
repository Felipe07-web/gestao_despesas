import React, { useEffect, useState } from "react";

const Cartoes = () => {
    const [cartoes, setCartoes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCartoes = async () => {
            try {
                const response = await fetch("http://localhost/api/cartoes");
                const data = await response.json();
                setCartoes(data);
            } catch (error) {
                console.error("Erro ao buscar cartões:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCartoes();
    }, []);

    if (isLoading) {
        return <div className="flex items-center justify-center h-full">Carregando...</div>;
    }

    return (
        <div className="p-8 bg-white shadow-xl rounded-xl">
            <h1 className="text-3xl font-extrabold mb-6 text-gray-900 tracking-tight">Cartões</h1>
    
            <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="w-full table-auto">
                    <thead className="bg-gray-50 text-gray-700 uppercase text-sm tracking-wider">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium">Cartão</th>
                            <th className="px-6 py-3 text-left font-medium">Banco</th>
                            <th className="px-6 py-3 text-left font-medium">Bandeira</th>
                            <th className="px-6 py-3 text-right font-medium">Limite</th>
                            <th className="px-4 py-3 text-center font-medium w-28">Fechamento</th>
                            <th className="px-4 py-3 text-center font-medium w-28">Vencimento</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartoes.map((cartao, index) => (
                            <tr
                                key={cartao.id}
                                className={`${
                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                } hover:bg-gray-100 transition-all duration-200`}
                            >
                                <td className="px-6 py-4 text-gray-800">{cartao.cartao}</td>
                                <td className="px-6 py-4 text-gray-700">{cartao.banco}</td>
                                <td className="px-6 py-4 text-gray-700">{cartao.bandeira}</td>
                                <td className="px-6 py-4 text-right font-medium text-green-600">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cartao.limite)}
                                </td>
                                <td className="px-4 py-4 text-center text-gray-700 text-sm">{cartao.data_fechamento}</td>
                                <td className="px-4 py-4 text-center text-gray-700 text-sm">{cartao.data_vencimento}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
    
};

export default Cartoes;
