import { useNavigate } from "react-router-dom";
import { ReportsTable } from "../../components/ReportsTable/ReportsTable";
import { useState } from "react";
import { Modal } from "../../components/Modal/Modal";
import { ReportByDateForm } from "../../components/ReportByDateForm/ReportByDateForm";

export const MonthlyReport = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center gap-4">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md hover:bg-gray-50 
                        transition-colors duration-200 hover:cursor-pointer border border-gray-200"
                        aria-label="Volver atrás"
                    >
                        <svg
                            className="w-5 h-5 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 uppercase">
                        Reportes mensuales
                    </h1>
                </div>

                <div className="bg-white rounded-lg shadow-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex justify-between">
                            <h2>
                                Lista de reportes mensuales
                            </h2>
                            <button
                                onClick={handleOpenModal}
                                className="px-3 py-1 bg-blue-700 text-white rounded-md 
                                hover:bg-blue-400  hover:cursor-pointer"
                            >
                                Reporte por fecha
                            </button>
                        </div>
                    </div>
                    <div className="p-6">
                        <ReportsTable />
                    </div>
                </div>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="REPORTE POR FECHAS"
            >
                <ReportByDateForm />
            </Modal>
        </div>
    );
};