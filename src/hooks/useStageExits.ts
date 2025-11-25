import { useState } from "react";
import { ftnService } from "../api/services/FtnService";
import type { FolioSearch, FolioEntrance, PartNumberDto, FolioSearchResponse } from "../api/services/FtnService";

export type { FolioSearch, FolioEntrance, PartNumberDto };

export interface ProcessExitResult {
    success: boolean;
    message: string;
    details?: Array<{
        folio: string;
        success: boolean;
        message: string;
        previousPlatforms?: number;
        currentPlatforms?: number;
        currentPieces?: number;
        previousPieces?: number;
    }>;
};

export interface SelectedItem {
    folio: number;
    partNumber: string;
    quantity: number;
    maxQuantity: number;
    isPlatforms: boolean;
};

export interface AccumulatedPartNumbers {
    [partNumber: string]: number;
};

export const useStageExits = () => {
    const [searchResults, setSearchResults] = useState<FolioSearch[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
    const [accumulatedPartNumbers, setAccumulatedPartNumbers] = useState<AccumulatedPartNumbers>({});

    const searchByFolio = async (folioNumber: string) => {
        if (!folioNumber.trim()) {
            setSearchResults([]);
            setAccumulatedPartNumbers({});
            return;
        }

        setLoading(true);
        setError(null);
        setSelectedItems([]);
        setAccumulatedPartNumbers({});

        try {
            const folioNum = parseInt(folioNumber);
            if (isNaN(folioNum)) {
                setError('Por favor ingresa un número de folio válido');
                return;
            }

            const response: FolioSearchResponse = await ftnService.searchByFolio(folioNum);

            const folioResults = response.folioResults || [];
            const accumulatedFromAPI = response.accumulatedPartNumbers || [];

            const accumulatedMap: AccumulatedPartNumbers = {};
            accumulatedFromAPI.forEach(item => {
                if (item.partNumber && item.totalQuantity) {
                    accumulatedMap[item.partNumber] = item.totalQuantity;
                }
            });

            setSearchResults(folioResults);
            setAccumulatedPartNumbers(accumulatedMap);
        } catch (err) {
            console.error('Error completo en searchByFolio:', err);
            setError('Error al buscar el folio');
        } finally {
            setLoading(false);
        }
    };

    const updateSelectedQuantity = (folio: number, partNumber: string, quantity: number, maxQuantity: number, isPlatforms: boolean = false) => {
        setSelectedItems(prev => {
            const filtered = prev.filter(item =>
                !(item.folio === folio && item.partNumber === partNumber && item.isPlatforms === isPlatforms)
            );

            if (quantity > 0) {
                return [...filtered, {
                    folio,
                    partNumber,
                    quantity,
                    maxQuantity,
                    isPlatforms
                }];
            }

            return filtered;
        });
    };

    const processExit = async (selectedItems: SelectedItem[]): Promise<ProcessExitResult> => {
        setLoading(true);
        setError(null);

        try {
            const itemsToProcess = selectedItems.map(item => ({
                folio: item.folio,
                partNumber: item.partNumber,
                quantity: item.quantity,
                isPlatforms: item.isPlatforms
            }));

            if (itemsToProcess.length === 0) {
                throw new Error('No hay items seleccionados para procesar');
            }

            const result = await ftnService.processExits(itemsToProcess);

            if (result.success) {
                setSelectedItems([]);

                if (searchResults.length > 0) {
                    const currentFolio = searchResults[0].folio.toString();
                    await searchByFolio(currentFolio);
                }

                return {
                    success: true,
                    message: result.message,
                    details: result.results
                };
            } else {
                throw new Error(result.message || 'Error al procesar las salidas');
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al procesar las salidas';
            setError(errorMessage);
            return {
                success: false,
                message: errorMessage
            };
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchResults([]);
        setSelectedItems([]);
        setError(null);
        setAccumulatedPartNumbers({});
    };

    const getTotalSelected = () => {
        return selectedItems.reduce((sum, item) => sum + item.quantity, 0);
    };

    const getSelectedQuantity = (folio: number, partNumber: string, isPlatforms: boolean = false) => {
        const item = selectedItems.find(item =>
            item.folio === folio && item.partNumber === partNumber && item.isPlatforms === isPlatforms
        );
        return item ? item.quantity : 0;
    };

    const getPartNumberQuantity = (partNumber: string): number => {
        return accumulatedPartNumbers[partNumber] || 0;
    };

    const isEntranceCompleted = (entrance: FolioEntrance): boolean => {
        if (!entrance) return true;
        return (entrance.platforms ?? 0) === 0 || !!entrance.exitDate;
    };

    return {
        searchResults,
        loading,
        error,
        selectedItems,
        accumulatedPartNumbers,
        searchByFolio,
        updateSelectedQuantity,
        processExit,
        clearSearch,
        getTotalSelected,
        getSelectedQuantity,
        getPartNumberQuantity,
        isEntranceCompleted
    };
};