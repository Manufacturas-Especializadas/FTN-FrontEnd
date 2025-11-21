import { useState } from "react";
import { useStageExits, type SearchResult } from "../../hooks/useStageExits";
import InputField from "../Inputs/InputField";
import FormButton from "../Inputs/FormButton";

export const FtnExitsForm = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const {
        searchResults,
        loading,
        error,
        selectedItems,
        searchByPartNumber,
        updateSelectedQuantity,
        processExit,
        clearSearch,
        getTotalSelected,
        getSelectedQuantity
    } = useStageExits();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        searchByPartNumber(searchTerm);
    };

    const handleQuantityChange = (folioId: number, partNumber: string, max: number, value: string, isPlatforms: boolean = false) => {
        if (value === "") {
            updateSelectedQuantity(folioId, partNumber, 0, max, isPlatforms);
            return;
        }

        const quantity = Number(value);

        if (!Number.isInteger(quantity)) return;
        if (quantity < 0) return;
        if (quantity > max) return;

        updateSelectedQuantity(folioId, partNumber, quantity, max, isPlatforms);
    };

    const handleProcessExit = async () => {
        const result = await processExit(selectedItems);

        if (result?.success) {
            if (result.details && result.details.length > 0) {
                const successDetails = result.details.filter(d => d.success);
                const errorDetails = result.details.filter(d => !d.success);

                let message = `✅ ${result.message}\n\n`;

                if (successDetails.length > 0) {
                    message += "**Procesados exitosamente:**\n";
                    successDetails.forEach(detail => {
                        const platformText = detail.previousPlatforms !== undefined ?
                            ` (${detail.previousPlatforms} → ${detail.currentPlatforms} tarimas)` :
                            detail.previousPieces !== undefined ?
                                ` (${detail.previousPieces} → ${detail.currentPieces} piezas)` : '';
                        message += `• Folio ${detail.folio}: ${detail.message}${platformText}\n`;
                    });
                }

                if (errorDetails.length > 0) {
                    message += "\n**Errores:**\n";
                    errorDetails.forEach(detail => {
                        message += `• Folio ${detail.folio}: ${detail.message}\n`;
                    });
                }

                alert(message);
            } else {
                alert(`✅ ${result.message}`);
            }

            setSearchTerm("");
            clearSearch();
        } else {
            console.error('Error processing exit:', result?.message);
        }
    };

    const handleCancel = () => {
        setSearchTerm("");
        clearSearch();
    };

    const totalSelected = getTotalSelected();

    const processSearchResults = (results: any[]): SearchResult[] => {
        if (!results || results.length === 0) return [];

        return results.map((result) => {
            if (result.partNumber && Array.isArray(result.folios)) {
                return result;
            }

            return {
                partNumber: result.partNumber || 'N/A',
                totalPlatforms: result.totalPlatforms || 0,
                totalPieces: result.totalPieces || 0,
                folios: Array.isArray(result.folios) ? result.folios : []
            };
        });
    };

    const processedResults = processSearchResults(searchResults);

    const AlertMessage = ({ message, type }: { message: string; type: 'success' | 'error' }) => (
        <div className={`p-3 ${type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border rounded-lg`}>
            <p className={`text-sm ${type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {message}
            </p>
        </div>
    );

    const getSelectionSummary = () => {
        const platforms = selectedItems.filter(item => item.isPlatforms);
        const pieces = selectedItems.filter(item => !item.isPlatforms);

        return {
            totalPlatforms: platforms.reduce((sum, item) => sum + item.quantity, 0),
            totalPieces: pieces.reduce((sum, item) => sum + item.quantity, 0),
            platformItems: platforms.length,
            pieceItems: pieces.length
        };
    };

    const selectionSummary = getSelectionSummary();

    return (
        <div className="space-y-6">
            <form onSubmit={handleSearch} className="space-y-4">
                <InputField
                    label="Buscar por número de parte"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ingresa el número de parte..."
                    className="mb-0"
                />
                <FormButton
                    type="button"
                    onClick={handleSearch}
                    disabled={loading || !searchTerm.trim()}
                    loading={loading}
                    className="w-full"
                >
                    {loading ? "Buscando..." : "Buscar"}
                </FormButton>
            </form>

            {error && <AlertMessage message={error} type="error" />}

            <div className="space-y-4 max-h-96 overflow-y-auto">
                {processedResults.length === 0 && searchTerm && !loading && (
                    <div className="text-center py-8 text-gray-500">
                        No se encontraron resultados para "{searchTerm}"
                    </div>
                )}

                {processedResults.map((result, resultIndex) => (
                    <div key={result.partNumber + resultIndex} className="border border-gray-200 rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-semibold text-gray-900 text-lg">
                                    {result.partNumber}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    📦 {result.totalPlatforms} tarimas • 🧩 {result.totalPieces} piezas
                                </p>
                            </div>
                            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                                {result.folios.length} folio(s)
                            </span>
                        </div>

                        <div className="space-y-3">
                            {result.folios.map((folio, folioIndex) => (
                                <div key={folio.folio + folioIndex} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900">
                                                Folio: {folio.folio}
                                            </span>
                                            {folio.exitDate && (
                                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                                                    Completado
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            🗄️ {folio.platforms} tarimas • 🧩 {folio.totalPieces} piezas
                                        </div>
                                    </div>

                                    <div className="text-xs text-gray-500 mb-3">
                                        📅 Entrada: {new Date(folio.entryDate).toLocaleDateString('es-MX')}
                                        {folio.exitDate && ` • Salida: ${new Date(folio.exitDate).toLocaleDateString('es-MX')}`}
                                    </div>

                                    {!folio.exitDate && (
                                        <div className="space-y-4">
                                            {/* Input para sacar tarimas - SIEMPRE VISIBLE */}
                                            <div className="bg-white p-3 rounded border">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <label className="font-medium text-gray-800">Sacar tarimas</label>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            Tarimas disponibles: {folio.platforms}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            max={folio.platforms}
                                                            value={getSelectedQuantity(folio.folio, result.partNumber, true)}
                                                            onChange={(e) => {
                                                                handleQuantityChange(folio.folio, result.partNumber, folio.platforms, e.target.value, true);
                                                            }}
                                                            className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-center"
                                                            placeholder="0"
                                                        />
                                                        <span className="text-sm text-gray-500">/ {folio.platforms}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Inputs para números de parte individuales (piezas) - SOLO SI HAY PARTNUMBERS */}
                                            {folio.partNumbers && folio.partNumbers.length > 0 && (
                                                <div>
                                                    <div className="text-sm font-medium text-gray-700 border-b pb-1 mb-2">
                                                        Sacar piezas por número de parte:
                                                    </div>
                                                    <div className="space-y-2">
                                                        {folio.partNumbers.map((part, partIndex) => (
                                                            <div key={part.partNumber + partIndex} className="flex items-center justify-between p-2 bg-white rounded border">
                                                                <div className="flex-1">
                                                                    <span className="font-medium text-gray-800">{part.partNumber}</span>
                                                                    <div className="text-xs text-gray-500 mt-1">
                                                                        Piezas disponibles: {part.quantity}
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-3">
                                                                    <div className="text-right">
                                                                        <label htmlFor={`quantity-${folio.folio}-${part.partNumber}`} className="text-sm text-gray-700 block mb-1">
                                                                            Cantidad:
                                                                        </label>
                                                                        <div className="flex items-center gap-2">
                                                                            <input
                                                                                id={`quantity-${folio.folio}-${part.partNumber}`}
                                                                                type="number"
                                                                                min={0}
                                                                                max={part.quantity}
                                                                                value={getSelectedQuantity(folio.folio, part.partNumber, false)}
                                                                                onChange={(e) => {
                                                                                    handleQuantityChange(folio.folio, part.partNumber, part.quantity, e.target.value, false);
                                                                                }}
                                                                                className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-center"
                                                                            />
                                                                            <span className="text-sm text-gray-500">/ {part.quantity}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {totalSelected > 0 && (
                <div className="border-t border-gray-200 pt-4 space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-700">
                                Total seleccionado:
                                {selectionSummary.totalPlatforms > 0 && (
                                    <span className="text-blue-600 ml-1">
                                        {selectionSummary.totalPlatforms} tarimas
                                    </span>
                                )}
                                {selectionSummary.totalPlatforms > 0 && selectionSummary.totalPieces > 0 && (
                                    <span className="mx-1">y</span>
                                )}
                                {selectionSummary.totalPieces > 0 && (
                                    <span className="text-green-600">
                                        {selectionSummary.totalPieces} piezas
                                    </span>
                                )}
                            </p>
                            <p className="text-xs text-gray-500">
                                {selectedItems.length} item(s) seleccionado(s)
                            </p>
                        </div>
                    </div>

                    {/* Detalle de selección */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm font-medium text-blue-800 mb-2">Detalle de selección:</p>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                            {selectedItems.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm text-blue-700">
                                    <span>
                                        Folio {item.folio} - {item.partNumber}
                                        <span className="text-xs ml-1 opacity-75">
                                            ({item.isPlatforms ? 'tarimas' : 'piezas'})
                                        </span>
                                    </span>
                                    <span>{item.quantity} {item.isPlatforms ? 'tarimas' : 'piezas'}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <FormButton
                            variant="secondary"
                            onClick={handleCancel}
                            disabled={loading}
                            className="flex-1"
                        >
                            Cancelar
                        </FormButton>
                        <FormButton
                            variant="primary"
                            onClick={handleProcessExit}
                            loading={loading}
                            disabled={loading}
                            className="flex-1"
                        >
                            Registrar salida
                        </FormButton>
                    </div>
                </div>
            )}

            {!searchTerm && processedResults.length === 0 && (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                        Buscar número de parte
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Ingresa un número de parte para ver las tarimas disponibles
                    </p>
                </div>
            )}
        </div>
    );
};