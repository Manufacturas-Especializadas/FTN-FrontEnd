import type { StageEntrance } from "../../types/StageEntrance";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    platform: StageEntrance | null;
    isDeleting: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const DeleteConfirmationModal = ({
    isOpen,
    platform,
    isDeleting,
    onConfirm,
    onCancel
}: DeleteConfirmationModalProps) => {
    if (!isOpen || !platform) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <div className="">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Confirmar Eliminación
                            </h3>
                            <p className="text-sm text-gray-500">
                                Esta acción no se puede deshacer
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-gray-700 mb-4">
                        ¿Estás seguro de que deseas eliminar el registro?
                    </p>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-red-600 font-semibold text-sm">
                                    {platform.folio.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <div className="font-medium text-red-800">
                                    {platform.folio}
                                </div>
                                <div className="text-sm text-red-600">
                                    {platform.partNumber} • {platform.entryDate}
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">
                        Se eliminarán todos los datos asociados a este registro de forma permanente.
                    </p>
                </div>

                <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    <button
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md 
                        hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-50 
                        disabled:cursor-not-allowed flex items-center hover:cursor-pointer"
                    >
                        {isDeleting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Eliminando...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Eliminar
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};