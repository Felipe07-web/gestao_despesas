import React, { useEffect, useState } from "react";

const TiposGanhos = () => {
    const [tiposGanhos, setTiposGanhos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTiposGanhos = async () => {
            try {
                const response = await fetch("http://localhost/api/tipos-ganhos");
                const data = await response.json();
                setTiposGanhos(data);
            } catch (error) {
                console.error("Erro ao buscar tipos de ganhos:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTiposGanhos();
    }, []);

    if (isLoading) {
        return <div className="flex items-center justify-center h-full">Carregando...</div>;
    }

    return (
        <div className="p-8 bg-white shadow-xl rounded-xl">
            <h1 className="text-3xl font-extrabold mb-6 text-gray-900 tracking-tight">Tipos de Ganhos</h1>
    
            <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="w-full table-auto">
                    <thead className="bg-gray-50 text-gray-700 uppercase text-sm tracking-wider">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium">ID</th>
                            <th className="px-6 py-3 text-left font-medium">Índice Tipo</th>
                            <th className="px-6 py-3 text-left font-medium">Tipo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tiposGanhos.map((ganho, index) => (
                            <tr
                                key={ganho.id}
                                className={`${
                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                } hover:bg-gray-100 transition-all duration-200`}
                            >
                                <td className="px-6 py-4 text-gray-800">{ganho.id}</td>
                                <td className="px-6 py-4 text-gray-700">{ganho.indice_tipo}</td>
                                <td className="px-6 py-4 text-gray-700">{ganho.tipo}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
    
};

export default TiposGanhos;
