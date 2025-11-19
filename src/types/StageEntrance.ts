export interface StageEntrance {
    id: number;
    folio: string;
    partNumber: string;
    platforms: number;
    numberOfPieces: number;
    entryDate: string;
    entranceFee?: number;
    storageCost?: number;
    exitDate?: string;
    daysInWarehouse: number;
    coustOut?: number;
    totalCost?: number;
};