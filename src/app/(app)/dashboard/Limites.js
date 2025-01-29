import React, { useEffect, useState } from "react";

const Limites = () => {
    const [limites, setLimites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLimites = async () => {
            try {
                const response = await fetch("http://localhost/api/limites");
                const data = await response.json();
                setLimites(data);
            } catch (error) {
                console.error("Erro ao buscar limites:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLimites();
    }, []);

    if (isLoading) {
        return <div className="flex items-center justify-center h-full">Carregando...</div>;
    }

    return (
        <div className="p-8 bg-white shadow-xl rounded-xl">
            <h1 className="text-3xl font-extrabold mb-6 text-gray-900 tracking-tight">Limites</h1>
    
            <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="w-full table-auto">
                    <thead className="bg-gray-50 text-gray-700 uppercase text-sm tracking-wider">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium">Subtipo 2</th>
                            <th className="px-6 py-3 text-right font-medium">Valor</th>
                            <th className="px-4 py-3 text-center font-medium w-32">Periodicidade</th>
                            <th className="px-4 py-3 text-center font-medium w-28">Meses</th>
                        </tr>
                    </thead>
                    <tbody>
                        {limites.map((limite, index) => (
                            <tr
                                key={limite.id}
                                className={`${
                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                } hover:bg-gray-100 transition-all duration-200`}
                            >
                                <td className="px-6 py-4 text-gray-800">{limite.subtipo_2}</td>
                                <td className="px-6 py-4 text-right font-medium text-green-600">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(limite.valor)}
                                </td>
                                <td className="px-4 py-4 text-center text-gray-700 text-sm">{limite.periodicidade}</td>
                                <td className="px-4 py-4 text-center text-gray-700 text-sm">{limite.numero_meses}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
    
};

export default Limites;
