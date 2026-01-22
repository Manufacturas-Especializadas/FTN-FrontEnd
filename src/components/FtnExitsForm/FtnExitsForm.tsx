import { useState } from "react";
import { useStageExits } from "../../hooks/useStageExits";
import type {
  FolioSearch,
  FolioEntrance,
  PartNumberDto,
  SelectedItem,
} from "../../hooks/useStageExits";
import InputField from "../Inputs/InputField";
import FormButton from "../Inputs/FormButton";

export const FtnExitsForm = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const {
    searchResults,
    loading,
    error,
    searchByFolio,
    processExit,
    clearSearch,
    getPartNumberQuantity,
    isEntranceCompleted,
  } = useStageExits();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchByFolio(searchTerm);
  };

  const handleProcessExit = async (folioId: number, maxPlatforms: number) => {
    const exitItem: SelectedItem = {
      folio: folioId,
      partNumber: `TARIMAS-${folioId}`,
      quantity: 1,
      maxQuantity: maxPlatforms,
      isPlatforms: true,
    };

    const result = await processExit([exitItem]);

    if (result?.success) {
      if (result.details && result.details.length > 0) {
        const successDetails = result.details.filter((d) => d.success);
        const errorDetails = result.details.filter((d) => !d.success);

        let message = `✅ ${result.message}\n\n`;

        if (successDetails.length > 0) {
          message += "**Procesados exitosamente:**\n";
          successDetails.forEach((detail) => {
            const platformText =
              detail.previousPlatforms !== undefined
                ? ` (${detail.previousPlatforms} → ${detail.currentPlatforms} tarimas)`
                : "";
            message += `• Folio ${detail.folio}: ${detail.message}${platformText}\n`;
          });
        }

        if (errorDetails.length > 0) {
          message += "\n**Errores:**\n";
          errorDetails.forEach((detail) => {
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
      console.error("Error processing exit:", result?.message);
    }
  };

  const AlertMessage = ({
    message,
    type,
  }: {
    message: string;
    type: "success" | "error";
  }) => (
    <div
      className={`p-3 ${type === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"} border rounded-lg`}
    >
      <p
        className={`text-sm ${type === "success" ? "text-green-800" : "text-red-800"}`}
      >
        {message}
      </p>
    </div>
  );

  const calculateEntrancePieces = (entrance: FolioEntrance): number => {
    if (!entrance || !Array.isArray(entrance.partNumbers))
      return entrance?.totalPieces || 0;

    return entrance.partNumbers.reduce(
      (sum: number, part: PartNumberDto) => sum + (part?.quantity || 0),
      0,
    );
  };

  const getCurrentFolioPartNumbers = (): string[] => {
    if (searchResults.length === 0) return [];

    const partNumbers = new Set<string>();
    searchResults.forEach((result) => {
      result.entrances?.forEach((entrance) => {
        entrance.partNumbers?.forEach((part) => {
          if (part.partNumber) {
            partNumbers.add(part.partNumber);
          }
        });
      });
    });

    return Array.from(partNumbers);
  };

  const currentFolioPartNumbers = getCurrentFolioPartNumbers();

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="space-y-4">
        <InputField
          label="Buscar por número de folio"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
        {searchResults.length === 0 && searchTerm && !loading && (
          <div className="text-center py-8 text-gray-500">
            No se encontraron resultados para el folio "{searchTerm}"
          </div>
        )}

        {searchResults.map((result: FolioSearch, resultIndex: number) => (
          <div
            key={result.folio + resultIndex}
            className="border border-gray-200 rounded-lg p-4 bg-white"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  Folio: {result.folio}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  📦 {result.totalPlatforms || 0} tarimas totales • 🧩{" "}
                  {result.totalPieces || 0} piezas totales
                </p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                {result.entrances?.length || 0} entrada(s)
              </span>
            </div>

            {/* Mostrar números de parte específicos de ESTE folio */}
            {currentFolioPartNumbers.length > 0 && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-700 text-sm mb-2">
                  📋 Números de parte en este folio:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentFolioPartNumbers.map((partNumber) => (
                    <span
                      key={partNumber}
                      className="bg-white px-3 py-1 rounded-full text-xs border border-gray-300"
                    >
                      {partNumber}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              {result.entrances?.map(
                (entrance: FolioEntrance, entranceIndex: number) => {
                  const entrancePieces = calculateEntrancePieces(entrance);
                  const isCompleted = isEntranceCompleted(entrance);
                  const remainingPlatforms = entrance?.platforms || 0;

                  return (
                    <div
                      key={`${entrance?.folio}-${entranceIndex}`}
                      className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            Entrada #{entranceIndex + 1}
                          </span>
                          {isCompleted && (
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                              Completado
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          🗄️ {remainingPlatforms} tarimas • 🧩 {entrancePieces}{" "}
                          piezas
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 mb-3">
                        📅 Entrada:{" "}
                        {entrance?.entryDate
                          ? new Date(entrance.entryDate).toLocaleDateString(
                              "es-MX",
                            )
                          : "N/A"}
                        {entrance?.exitDate &&
                          ` • Salida: ${new Date(entrance.exitDate).toLocaleDateString("es-MX")}`}
                      </div>

                      {!isCompleted && remainingPlatforms > 0 && (
                        <div className="space-y-4">
                          <div className="bg-white p-3 rounded border">
                            <div className="flex items-center justify-between">
                              <div>
                                <label className="font-medium text-gray-800">
                                  Sacar tarima
                                </label>
                                <div className="text-xs text-gray-500 mt-1">
                                  Al sacar la tarima se descontarán
                                  automáticamente las piezas correspondientes
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Tarimas disponibles: {remainingPlatforms}
                                </div>
                              </div>
                              <FormButton
                                variant="primary"
                                onClick={() =>
                                  handleProcessExit(
                                    entrance.folio,
                                    remainingPlatforms,
                                  )
                                }
                                loading={loading}
                                disabled={loading}
                                className="px-4 py-2"
                              >
                                Sacar tarima
                              </FormButton>
                            </div>
                          </div>

                          {entrance?.partNumbers &&
                            entrance.partNumbers.length > 0 && (
                              <div className="bg-white p-3 rounded border">
                                <div className="text-sm font-medium text-gray-700 border-b pb-2 mb-2">
                                  Números de parte en esta entrada (se
                                  descontarán automáticamente):
                                </div>
                                <div className="space-y-2">
                                  {entrance.partNumbers.map(
                                    (
                                      part: PartNumberDto,
                                      partIndex: number,
                                    ) => {
                                      const totalAvailable =
                                        getPartNumberQuantity(part.partNumber);
                                      return (
                                        <div
                                          key={part.partNumber + partIndex}
                                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                        >
                                          <div className="flex-1">
                                            <span className="font-medium text-gray-800 text-sm">
                                              {part.partNumber}
                                            </span>
                                            <div className="text-xs text-gray-500 mt-1">
                                              En esta entrada:{" "}
                                              {part.quantity || 0} piezas •
                                              Total disponible: {totalAvailable}{" "}
                                              piezas
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    },
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      )}

                      {!isCompleted && remainingPlatforms === 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                          <p className="text-sm text-yellow-800 text-center">
                            No hay tarimas disponibles para sacar
                          </p>
                        </div>
                      )}
                    </div>
                  );
                },
              )}
            </div>
          </div>
        ))}
      </div>

      {!searchTerm && searchResults.length === 0 && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Buscar por número de folio
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Ingresa un número de folio para ver las tarimas disponibles
          </p>
        </div>
      )}
    </div>
  );
};
