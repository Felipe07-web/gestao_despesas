"use client";

import { useState } from "react";
import Header from "@/app/(app)/Header";
import TiposGastos from "./TiposGastos";
import TiposGanhos from "./TiposGanhos";
import { 
    FaDollarSign, FaChartLine, FaBuilding, FaFileContract, 
    FaCreditCard, FaBalanceScale, FaMoneyBillWave, 
    FaHandHoldingUsd, FaUniversity, FaClipboardList, FaWallet, FaChartPie, FaPlusCircle
} from "react-icons/fa";
import Empresas from "./Empresas";
import Cartoes from "./Cartoes";
import Limites from "./Limites";
import Contratos from "./Contratos";
import Gastos from "./Gastos";
import Recebimentos from "./Recebimentos";
import Bancos from "./Bancos";

const Dashboard = () => {
    const [selectedSection, setSelectedSection] = useState("home");

    const menuItems = [
        { name: "Tipos de Gastos", icon: <FaDollarSign size={18} />, key: "tipos-gastos" },
        { name: "Tipos de Ganhos", icon: <FaChartLine size={18} />, key: "tipos-ganhos" },
        { name: "Empresa", icon: <FaBuilding size={18} />, key: "empresa" },
        { name: "Contratos", icon: <FaFileContract size={18} />, key: "contratos" },
        { name: "Cartões", icon: <FaCreditCard size={18} />, key: "cartoes" },
        { name: "Limites", icon: <FaBalanceScale size={18} />, key: "limites" },
        { name: "Gastos", icon: <FaMoneyBillWave size={18} />, key: "gastos" },
        { name: "Recebidos", icon: <FaHandHoldingUsd size={18} />, key: "recebidos" },
        { name: "Banco", icon: <FaUniversity size={18} />, key: "banco" },
    ];

    return (
        <>
            {/* Header atualizado com ícone de gestão financeira */}
            <Header title="Dashboard" subtitle="Gestão Financeira" icon={<FaClipboardList size={28} className="text-blue-600" />} />

            <div className="flex min-h-screen bg-[#f4f6f9]">
                {/* Sidebar */}
                <aside className="w-72 bg-white text-gray-700 shadow-lg border-r border-gray-200">
                    <nav>
                        <ul className="mt-6">
                            {menuItems.map((item) => (
                                <li 
                                    key={item.key}
                                    className={`flex items-center gap-4 px-6 py-4 text-gray-600 hover:bg-gray-100 cursor-pointer transition-all rounded-lg 
                                    ${selectedSection === item.key ? 'bg-gray-200 font-semibold text-gray-900' : ''}`}
                                    onClick={() => setSelectedSection(item.key)}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-10">
                    <div className="max-w-7xl mx-auto">
                        {selectedSection === "tipos-gastos" && <TiposGastos />}
                        {selectedSection === "tipos-ganhos" && <TiposGanhos />}
                        {selectedSection === "empresa" && <Empresas />}
                        {selectedSection === "cartoes" && <Cartoes />}
                        {selectedSection === "limites" && <Limites />}
                        {selectedSection === "contratos" && <Contratos />}
                        {selectedSection === "gastos" && <Gastos />}
                        {selectedSection === "recebidos" && <Recebimentos />}
                        {selectedSection === "banco" && <Bancos />}

                        {selectedSection === "home" && (
                            <div className="flex flex-col items-center justify-center text-center">
                                {/* Banner de Gestão Financeira */}
                                <div className="bg-blue-50 w-full p-6 rounded-xl flex items-center justify-between shadow-md">
                                    <div className="text-left">
                                        <h1 className="text-3xl font-extrabold text-gray-900">Controle suas Despesas com Facilidade</h1>
                                        <p className="text-gray-600 mt-2 text-lg">
                                            Monitore gastos, acompanhe receitas e tenha controle total sobre suas finanças.
                                        </p>
                                    </div>
                                    <div className="text-blue-600">
                                        <FaClipboardList size={60} />
                                    </div>
                                </div>

                                {/* Indicadores Financeiros */}
                                <div className="mt-10 grid grid-cols-3 gap-6 max-w-5xl w-full">
                                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
                                        <FaWallet size={36} className="text-green-600" />
                                        <div>
                                            <p className="text-black-600  ttext-sm">Saldo Atual</p>
                                            
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
                                        <FaChartPie size={36} className="text-red-600" />
                                        <div>
                                            <p className="text-black-600 text-sm ">Gastos no Mês</p>
                                            
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
                                        <FaPlusCircle size={36} className="text-blue-600" />
                                        <div>
                                            <p className="text-black-600 text-sm">Receitas no Mês</p>
                                            
                                        </div>
                                    </div>
                                </div>

                                {/* Call to Action */}
                                <div className="mt-10">
                                   
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
};

export default Dashboard;
