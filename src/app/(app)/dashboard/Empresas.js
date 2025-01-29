import React, { useEffect, useState } from "react";

const Empresas = () => {
    const [empresas, setEmpresas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEmpresas = async () => {
            try {
                const response = await fetch("http://localhost/api/empresas");
                const data = await response.json();
                setEmpresas(data);
            } catch (error) {
                console.error("Erro ao buscar empresas:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmpresas();
    }, []);

    if (isLoading) {
        return <div className="flex items-center justify-center h-full">Carregando...</div>;
    }

    return (
        <div className="p-8 bg-white shadow-xl rounded-xl">
            <h1 className="text-3xl font-extrabold mb-6 text-gray-900 tracking-tight">Empresas</h1>
    
            <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="w-full table-auto">
                    <thead className="bg-gray-50 text-gray-700 uppercase text-sm tracking-wider">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium">Empresa</th>
                            <th className="px-6 py-3 text-left font-medium">Nome</th>
                            <th className="px-6 py-3 text-left font-medium">Tipo de Contrato</th>
                        </tr>
                    </thead>
                    <tbody>
                        {empresas.map((empresa, index) => (
                            <tr
                                key={empresa.id}
                                className={`${
                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                } hover:bg-gray-100 transition-all duration-200`}
                            >
                                <td className="px-6 py-4 text-gray-800">{empresa.empresa}</td>
                                <td className="px-6 py-4 text-gray-700">{empresa.nome}</td>
                                <td className="px-6 py-4 text-gray-700">{empresa.tipo_contrato}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
    
};

export default Empresas;
