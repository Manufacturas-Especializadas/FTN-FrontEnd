import { useState } from "react";
import type { StageEntrance } from "../../types/StageEntrance";
import { useDeleteModal } from "../../hooks/useDeleteModal";
import { ftnService } from "../../api/services/FtnService";
import { formatDateTime } from "../../utils/dateFormatter";
import { Modal } from "../Modal/Modal";
import { FtnExitForm } from "../FtnExitForm/FtnExitForm";
import { DeleteConfirmationModal } from "../DeleteConfirmModal/DeleteConfirmModal";
import { usePlatformsMetrics } from "../../hooks/usePlatformsMetrics";

interface Props {
    data: StageEntrance[];
    onDelete?: () => void;
    onEdit?: (platform: StageEntrance) => void;
    onExit?: () => void;
};

export const FtnTable = ({ data, onDelete, onEdit, onExit }: Props) => {
    const { dataMetrics } = usePlatformsMetrics(data);
    const [currentPage, setCurrentPage] = useState(1);
    const [isExitModalOpen, setIsExitModalOpen] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState<StageEntrance | null>(null);
    const itemsPerPage = 10;

    const {
        deleteModal,
        openDeleteModal,
        closeDeleteModal,
        startDeleting,
        stopDeleting
    } = useDeleteModal();

    const totalPages = Math.ceil(dataMetrics.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentDataMetrics = dataMetrics.slice(startIndex, endIndex);

    const getPagesNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    const handleDelete = async () => {
        if (!deleteModal.plattaform) return;

        startDeleting();

        try {
            await ftnService.delete(deleteModal.plattaform.id);
            closeDeleteModal();

            if (onDelete) {
                onDelete();
            }
        } catch (error: any) {
            console.error("Error al eliminar el registro: ", error);
        } finally {
            stopDeleting();
        }
    };

    const handleEdit = (platform: StageEntrance) => {
        if (onEdit) {
            onEdit(platform);
        }
    };

    // const handleOpenExitModal = (platform: StageEntrance) => {
    //     setSelectedPlatform(platform);
    //     setIsExitModalOpen(true);
    // };

    const handleCloseExitModal = () => {
        setIsExitModalOpen(false);
        setSelectedPlatform(null);
    };

    const handleExitSuccess = () => {
        handleCloseExitModal();
        if (onExit) {
            onExit();
        }
    };

    const handlePrevious = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNext = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Folio
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Número de parte
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cantidad de tarimas
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cantidad de piezas
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fecha de entrada
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {
                            currentDataMetrics.map((platform) => (
                                <tr
                                    key={platform.id}
                                    className="hover:bg-gray-50 transition-colors duration-150"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {platform.folio}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {platform.partNumber}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {platform.platforms}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {platform.numberOfPieces}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {formatDateTime(platform.entryDate)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {/* {
                                            !platform.exitDate && (
                                                <button
                                                    onClick={() => handleOpenExitModal(platform)}
                                                    className="text-green-600 hover:text-green-900 mr-3 transition-colors duration-200 hover:cursor-pointer"
                                                >
                                                    Salida
                                                </button>
                                            )
                                        } */}
                                        {
                                            !platform.exitDate && (
                                                <button
                                                    onClick={() => handleEdit(platform)}
                                                    className="text-blue-600 hover:text-blue-900 mr-3 transition-colors duration-200 hover:cursor-pointer"
                                                >
                                                    Editar
                                                </button>
                                            )
                                        }
                                        <button
                                            onClick={() => openDeleteModal(platform)}
                                            className="text-red-600 hover:text-red-900 transition-colors duration-200 hover:cursor-pointer disabled:text-red-300 disabled:cursor-not-allowed"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 text-sm font-medium rounded-md ${currentPage === 1
                                ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:cursor-pointer"
                                }`}
                        >
                            Anterior
                        </button>

                        <div className="hidden md:flex space-x-1">
                            {getPagesNumbers().map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-4 py-2 text-sm font-medium rounded-md ${currentPage === page
                                        ? "bg-blue-600 text-white hover:cursor-pointer"
                                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:cursor-pointer"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <div className="md:hidden text-sm text-gray-700">
                            Página {currentPage} de {totalPages}
                        </div>

                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 text-sm font-medium rounded-md ${currentPage === totalPages
                                ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:cursor-pointer"
                                }`}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}

            {dataMetrics.length === 0 && (
                <div className="px-6 py-12 text-center">
                    <div className="text-gray-500 text-lg">
                        No hay datos disponibles
                    </div>
                    <div className="text-gray-400 text-sm mt-2">
                        No se encontraron registros para mostrar
                    </div>
                </div>
            )}

            <Modal
                isOpen={isExitModalOpen}
                onClose={handleCloseExitModal}
                title="REGISTRAR SALIDA DE TARIMAS"
            >
                {selectedPlatform && (
                    <FtnExitForm
                        platform={selectedPlatform}
                        onSuccess={handleExitSuccess}
                        onCancel={handleCloseExitModal}
                    />
                )}
            </Modal>

            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                platform={deleteModal.plattaform}
                isDeleting={deleteModal.isDeleting}
                onConfirm={handleDelete}
                onCancel={closeDeleteModal}
            />
        </div>
    );
};