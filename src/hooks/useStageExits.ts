import { useState } from "react";
import { ftnService } from "../api/services/FtnService";
import type { Folio } from "../types/Folio";

export interface PartNumberDetail {
    partNumber: string;
    quantity: number;
};

export interface FolioWithDetails extends Folio {
    partNumbers?: PartNumberDetail[];
};

export interface SearchResult {
    partNumber: string;
    totalPlatforms: number;
    totalPieces: number;
    folios: FolioWithDetails[];
};

export interface ApiSearchResponse {
    partNumber?: string;
    totalPlatforms?: number;
    totalPieces?: number;
    folios?: FolioWithDetails[] | SearchResult;
};

// Corregir la interfaz ProcessExitResult
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
}

export const useStageExits = () => {
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

    const searchByPartNumber = async (partNumber: string) => {
        if (!partNumber.trim()) {
            setSearchResults([]);
            return;
        }

        setLoading(true);
        setError(null);
        setSelectedItems([]);

        try {
            const results = await ftnService.searchByPartNumber(partNumber);
            const normalizedResults = Array.isArray(results) ? results : [results];

            const processedResults = normalizedResults.map(result => {
                const foliosWithDetails: FolioWithDetails[] = (result.folios || []).map((folio: any) => {
                    let partNumbers: PartNumberDetail[] = [];

                    if (folio.partNumber && folio.numberOfPieces) {
                        const partNumbersArray = folio.partNumber.split(',').map((p: string) => p.trim()).filter((p: string) => p !== "");

                        if (partNumbersArray.length > 0) {
                            const quantityPerPart = Math.floor(folio.numberOfPieces / partNumbersArray.length);
                            partNumbers = partNumbersArray.map((part: string) => ({
                                partNumber: part,
                                quantity: quantityPerPart
                            }));
                        } else {
                            partNumbers = [{
                                partNumber: folio.partNumber,
                                quantity: folio.numberOfPieces
                            }];
                        }
                    }

                    return {
                        ...folio,
                        partNumbers: partNumbers
                    };
                });

                return {
                    ...result,
                    folios: foliosWithDetails
                };
            });

            setSearchResults(processedResults);
        } catch (err) {
            setError('Error al buscar el número de parte');
            console.error('Search error:', err);
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
                setSearchResults([]);

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

    return {
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
    };
};