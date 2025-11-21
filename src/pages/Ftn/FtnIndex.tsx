import { useState } from "react";
import type { StageEntrance } from "../../types/StageEntrance";
import { Modal } from "../../components/Modal/Modal";
import { FtnForm } from "../../components/FtnForm/FtnForm";
import { Loading } from "../../components/Loading/Loading";
import { useStageEntrance } from "../../hooks/useStageEntrance";
import { FtnTable } from "../../components/FtnTable/FtnTable";
import { AdvancedFilters } from "../../components/Filters/AndvancedFilters";
import { usePlatformsMetrics } from "../../hooks/usePlatformsMetrics";
import { useNavigate } from "react-router-dom";
import { FtnExitsForm } from "../../components/FtnExitsForm/FtnExitsForm";
// import { MetricsDashboard } from "../../components/Dashboard/MetricsDashboard";

export const FtnIndex = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenExits, setIsModalOpenExits] = useState(false);
    const [editing, setEditing] = useState<StageEntrance | null>(null);
    const [filters, setFilters] = useState<any>({});

    const { data, error, refetch } = useStageEntrance();
    const { dataMetrics } = usePlatformsMetrics(data);
    const loading = !data && !error;

    const navigate = useNavigate();

    const filteredData = dataMetrics?.filter(item => {
        if (filters.estado === 'activos' && item.exitDate) return false;
        if (filters.estado === 'completados' && !item.exitDate) return false;
        if (filters.partNumber && !item.partNumbers.includes(filters.partNumber)) return false;
        if (filters.fechaInicio && new Date(item.entryDate) < new Date(filters.fechaInicio)) return false;
        if (filters.fechaFin && new Date(item.entryDate) > new Date(filters.fechaFin)) return false;
        return true;
    }) || [];

    const handleOpenModal = (item: StageEntrance | null = null) => {
        setEditing(item);
        setIsModalOpen(true);
    };

    const handleOpenModalExits = () => {
        setIsModalOpenExits(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditing(null);
    };

    const handleCloseModalExits = () => {
        setIsModalOpenExits(false);
    };
    const handleCreate = () => {
        handleOpenModal(null);
    };

    const handleFormSuccess = () => {
        handleCloseModal();
        refetch();
    };

    const handleEdit = (item: StageEntrance) => {
        handleOpenModal(item);
    };

    const handleExitSuccess = () => {
        refetch();
    };

    const renderCreateButton = () => (
        <>
            <button
                onClick={() => navigate("/reporte-mensual")}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors 
                    duration-200 shadow-md flex items-center hover:cursor-pointer"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Reportes
            </button>
            <button
                onClick={handleOpenModalExits}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors 
                    duration-200 shadow-md flex items-center hover:cursor-pointer"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Salidas
            </button>
            <button
                onClick={handleCreate}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors 
                    duration-200 shadow-md flex items-center hover:cursor-pointer"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nueva entrada
            </button>
        </>
    );

    const renderContent = () => {
        if (loading) return <Loading />;
        if (error) return <div className="text-red-600">Error al cargar los datos</div>;

        if (filteredData.length > 0) {
            return (
                <FtnTable
                    data={filteredData}
                    onEdit={handleEdit}
                    onDelete={refetch}
                    onExit={handleExitSuccess}
                />
            );
        }

        return (
            <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron registros</h3>
                <p className="mt-1 text-sm text-gray-500">Intenta ajustar los filtros de búsqueda.</p>
                <button
                    onClick={handleCreate}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg 
                    font-medium transition-colors duration-200 hover:cursor-pointer"
                >
                    Registrar nueva entrada
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 uppercase">
                        Gestión de tarimas
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Sistema integral de control y seguimiento de tarimas en almacén
                    </p>
                </div>

                {/* <MetricsDashboard /> */}

                <AdvancedFilters onFilter={setFilters} />

                <div className="bg-white rounded-lg shadow-lg">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Lista de tarimas {filteredData.length > 0 && `(${filteredData.length})`}
                        </h2>
                        <div className="flex gap-3">
                            {renderCreateButton()}
                        </div>
                    </div>
                    <div className="p-6">
                        {renderContent()}
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editing ? "EDITAR INFORMACIÓN" : "REGISTRAR NUEVA ENTRADA"}
            >
                <FtnForm
                    platform={editing}
                    onSuccess={handleFormSuccess}
                    onCancel={handleCloseModal}
                />
            </Modal>

            <Modal
                isOpen={isModalOpenExits}
                onClose={handleCloseModalExits}
                title="SALIDAS"
            >
                <FtnExitsForm />
            </Modal>
        </div>
    );
};