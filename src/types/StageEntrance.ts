import type { StageEntrancePartNumber } from "./StageEntrancePartNumber";

export interface StageEntrance {
    id?: number;
    folio: number;
    totalPieces: number;
    platforms?: number;
    idStorageCost?: number;
    idEntranceFee?: number;
    entryDate: string;
    exitDate?: string;
    createdAt?: string;
    updatedAt?: string;
    partNumbers: StageEntrancePartNumber[];
};