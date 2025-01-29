import React, { useEffect, useState } from "react";

const Recebimentos = () => {
    const [recebimentos, setRecebimentos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRecebimentos = async () => {
            try {
                const response = await fetch("http://localhost/api/recebimentos");
                const data = await response.json();
                setRecebimentos(data);
            } catch (error) {
                console.error("Erro ao buscar recebimentos:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecebimentos();
    }, []);

    if (isLoading) {
        return <div className="flex items-center justify-center h-full">Carregando...</div>;
    }

    return (
        <div className="p-8 bg-white shadow-xl rounded-xl">
            <h1 className="text-3xl font-extrabold mb-6 text-gray-900 tracking-tight">Recebimentos</h1>
    
            <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="w-full table-auto">
                    <thead className="bg-gray-50 text-gray-700 uppercase text-sm tracking-wider">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium">Data</th>
                            <th className="px-6 py-3 text-left font-medium">Fonte</th>
                            <th className="px-6 py-3 text-left font-medium">Referente</th>
                            <th className="px-6 py-3 text-right font-medium">Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recebimentos.map((recebimento, index) => (
                            <tr
                                key={recebimento.id}
                                className={`${
                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                } hover:bg-gray-100 transition-all duration-200`}
                            >
                                <td className="px-6 py-4 text-gray-700 text-sm">{recebimento.data}</td>
                                <td className="px-6 py-4 text-gray-700">{recebimento.fonte}</td>
                                <td className="px-6 py-4 text-gray-700">{recebimento.referente}</td>
                                <td className="px-6 py-4 text-right font-medium text-green-600">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(recebimento.valor)}
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
