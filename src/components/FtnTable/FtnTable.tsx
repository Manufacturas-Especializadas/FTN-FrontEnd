import { useState } from "react";
import type { StageEntrance } from "../../types/StageEntrance";
import { useDeleteModal } from "../../hooks/useDeleteModal";
// import { ftnService } from "../../api/services/FtnService";
import { formatDateTime } from "../../utils/dateFormatter";
import { DeleteConfirmationModal } from "../DeleteConfirmModal/DeleteConfirmModal";
import { usePlatformsMetrics } from "../../hooks/usePlatformsMetrics";
import { ftnService } from "../../api/services/FtnService";

interface Props {
  data: StageEntrance[];
  onDelete?: () => void;
  onEdit?: (platform: StageEntrance) => void;
  onExit?: () => void;
}

export const FtnTable = ({ data, onDelete, onEdit }: Props) => {
  const { dataMetrics } = usePlatformsMetrics(data);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    deleteModal,
    openDeleteModal,
    closeDeleteModal,
    startDeleting,
    stopDeleting,
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
      await ftnService.delete(deleteModal.plattaform.id!);
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

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const formatPartNumbers = (partNumbers: any[]) => {
    if (!partNumbers || partNumbers.length === 0) return "N/A";

    if (Array.isArray(partNumbers)) {
      return partNumbers
        .map((pn) => pn.partNumber || pn.PartNumber || pn)
        .join(", ");
    }

    return "N/A";
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Folio
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Números de parte
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Cantidad de tarimas
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Total de piezas
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Fecha de entrada
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentDataMetrics.map((platform) => (
              <tr
                key={platform.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{platform.folio}</div>
                </td>
                <td className="px-6 py-4">
                  <div
                    className="text-sm text-gray-500 max-w-xs truncate"
                    title={formatPartNumbers(platform.partNumbers)}
                  >
                    {formatPartNumbers(platform.partNumbers)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {platform.platforms || 0}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {platform.totalPieces || 0}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {formatDateTime(platform.entryDate)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {!platform.exitDate && (
                    <button
                      onClick={() => handleEdit(platform)}
                      className="text-blue-600 hover:text-blue-900 mr-3 transition-colors duration-200 hover:cursor-pointer"
                    >
                      Editar
                    </button>
                  )}
                  <button
                    onClick={() => openDeleteModal(platform)}
                    className="text-red-600 hover:text-red-900 transition-colors duration-200 hover:cursor-pointer disabled:text-red-300 disabled:cursor-not-allowed"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                currentPage === 1
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
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    currentPage === page
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
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                currentPage === totalPages
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
          <div className="text-gray-500 text-lg">No hay datos disponibles</div>
          <div className="text-gray-400 text-sm mt-2">
            No se encontraron registros para mostrar
          </div>
        </div>
      )}

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
