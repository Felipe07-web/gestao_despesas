import React, { useEffect, useState } from "react";

const Gastos = () => {
    const [gastos, setGastos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGastos = async () => {
            try {
                const response = await fetch("http://localhost/api/gastos");
                const data = await response.json();
                setGastos(data);
            } catch (error) {
                console.error("Erro ao buscar gastos:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGastos();
    }, []);

    if (isLoading) {
        return <div className="flex items-center justify-center h-full">Carregando...</div>;
    }

    return (
        <div className="p-8 bg-white shadow-xl rounded-xl">
            <h1 className="text-3xl font-extrabold mb-6 text-gray-900 tracking-tight">Gastos</h1>
    
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
                        </tr>
                    </thead>
                    <tbody>
                        {gastos.map((gasto, index) => (
                            <tr
                                key={gasto.id}
                                className={`${
                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                } hover:bg-gray-100 transition-all duration-200`}
                            >
                                <td className="px-6 py-4 text-gray-800">{gasto.subtipo_2}</td>
                                <td className="px-4 py-4 text-center text-gray-700 text-sm">{gasto.data}</td>
                                <td className="px-6 py-4 text-gray-700">{gasto.gasto}</td>
                                <td className="px-6 py-4 text-right font-medium text-red-500">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(gasto.valor)}
                                </td>
                                <td className="px-4 py-4 text-center text-gray-700 text-sm">{gasto.parcelas}</td>
                                <td className="px-6 py-4 text-gray-700">{gasto.cartao}</td>
                                <td className="px-4 py-4 text-center text-gray-700 text-sm">{gasto.vencimento_boleto}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
    
};

export default Gastos;
