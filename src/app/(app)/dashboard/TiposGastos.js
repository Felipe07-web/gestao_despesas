import React, { useEffect, useState } from "react";

const TiposGastos = () => {
    const [tiposGastos, setTiposGastos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTiposGastos = async () => {
            try {
                const response = await fetch("http://localhost/api/tipos-gastos");
                const data = await response.json();
                setTiposGastos(data);
            } catch (error) {
                console.error("Erro ao buscar tipos de gastos:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTiposGastos();
    }, []);

    if (isLoading) {
        return <div className="flex items-center justify-center h-full">Carregando...</div>;
    }

    return (
        <div className="p-8 bg-white shadow-xl rounded-xl">
            <h1 className="text-3xl font-extrabold mb-6 text-gray-900 tracking-tight">Tipos de Gastos</h1>
    
            <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="w-full table-auto">
                    <thead className="bg-gray-50 text-gray-700 uppercase text-sm tracking-wider">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium">ID</th>
                            <th className="px-6 py-3 text-left font-medium">Índice Tipo</th>
                            <th className="px-6 py-3 text-left font-medium">Tipo</th>
                            <th className="px-6 py-3 text-left font-medium">Índice Subtipo 1</th>
                            <th className="px-6 py-3 text-left font-medium">Subtipo 1</th>
                            <th className="px-6 py-3 text-left font-medium">Índice Subtipo 2</th>
                            <th className="px-6 py-3 text-left font-medium">Subtipo 2</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tiposGastos.map((gasto, index) => (
                            <tr
                                key={gasto.id}
                                className={`${
                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                } hover:bg-gray-100 transition-all duration-200`}
                            >
                                <td className="px-6 py-4 text-gray-800">{gasto.id}</td>
                                <td className="px-6 py-4 text-gray-700">{gasto.indice_tipo}</td>
                                <td className="px-6 py-4 text-gray-700">{gasto.tipo}</td>
                                <td className="px-6 py-4 text-gray-700">{gasto.indice_subtipo_1}</td>
                                <td className="px-6 py-4 text-gray-700">{gasto.subtipo_1}</td>
                                <td className="px-6 py-4 text-gray-700">{gasto.indice_subtipo_2}</td>
                                <td className="px-6 py-4 text-gray-700">{gasto.subtipo_2}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
    
};

export default TiposGastos;
