import React, { useEffect, useState } from "react";

const Contratos = () => {
    const [contratos, setContratos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchContratos = async () => {
            try {
                const response = await fetch("http://localhost/api/contratos");
                const data = await response.json();
                setContratos(data);
            } catch (error) {
                console.error("Erro ao buscar contratos:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContratos();
    }, []);

    if (isLoading) {
        return <div className="flex items-center justify-center h-full">Carregando...</div>;
    }

    return (
        <div className="p-8 bg-white shadow-xl rounded-xl">
            <h1 className="text-3xl font-extrabold mb-6 text-gray-900 tracking-tight">Contratos</h1>
    
            <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="w-full table-auto">
                    <thead className="bg-gray-50 text-gray-700 uppercase text-sm tracking-wider">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium">Contrato</th>
                            <th className="px-6 py-3 text-left font-medium">Empresa</th>
                            <th className="px-6 py-3 text-left font-medium">Horas Médias</th>
                            <th className="px-6 py-3 text-right font-medium">Salário</th>
                            <th className="px-6 py-3 text-right font-medium">Descontos</th>
                            <th className="px-6 py-3 text-right font-medium">Benefício</th>
                            <th className="px-4 py-3 text-center font-medium w-20">Início</th>
                            <th className="px-4 py-3 text-center font-medium w-20">Fim</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contratos.map((contrato, index) => (
                            <tr
                                key={contrato.id}
                                className={`${
                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                } hover:bg-gray-100 transition-all duration-200`}
                            >
                                <td className="px-6 py-4 text-gray-800">{contrato.contrato}</td>
                                <td className="px-6 py-4 text-gray-700">{contrato.empresa}</td>
                                <td className="px-6 py-4 text-gray-700">{contrato.horas_medias}</td>
                                <td className="px-6 py-4 text-right text-gray-800 font-medium">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(contrato.salario)}
                                </td>
                                <td className="px-6 py-4 text-right text-red-500 font-medium">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(contrato.descontos)}
                                </td>
                                <td className="px-6 py-4 text-right text-green-600 font-medium">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(contrato.beneficio)}
                                </td>
                                <td className="px-4 py-4 text-center text-gray-700 text-sm font-medium w-20">
                                    {new Date(contrato.inicio).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                                </td>
                                <td className="px-4 py-4 text-center text-gray-700 text-sm font-medium w-20">
                                    {new Date(contrato.fim).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
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
