import { API_CONFIG } from "../../config/api";
import type { StageEntrance } from "../../types/StageEntrance";
import { apiClient } from "../client";

export interface FtnFormData {
    folio: string;
    partNumber: string;
    numberOfPieces: number;
    entryDate: string;
};

export interface FtnPatchFormData {
    platforms: number;
    exitDate: string;
};

export interface FtnResponse {
    success?: boolean;
    message?: string;
    idStageEntrances: number;
};

export interface MonthlyReportResponse {
    year: number;
    month: number;
    monthName: string;
    totalRecords: number;
    totalPallets: number;
    activeRecords: number;
    completedRecords: number;
    totalEntryCost: number;
    totalExitCost: number;
    totalStorageCost: number;
    totalGeneralCost: number;
    records: RecordDetail[];
};

export interface RecordDetail {
    id: number;
    folio: string;
    partNumber: string;
    platforms: number;
    entryDate: string;
    exitDate?: string;
    daysInStorage: number;
    entryCost: number;
    exitCost: number;
    storageCost: number;
    totalCost: number;
    isActive: boolean;
    status: string;
};

class FtnService {
    private getStageEntranceEndpoint = API_CONFIG.endpoints.ftn.getStageEntrance;
    private createEndpoint = API_CONFIG.endpoints.ftn.create;
    private updateEndpoint = API_CONFIG.endpoints.ftn.update;
    private patchEndpoint = API_CONFIG.endpoints.ftn.patch;
    private deleteEndpoint = API_CONFIG.endpoints.ftn.delete;

    async getStageEntrance(): Promise<StageEntrance[]> {
        return apiClient.get<StageEntrance[]>(this.getStageEntranceEndpoint);
    };

    async create(formData: FtnFormData): Promise<FtnResponse> {
        return apiClient.post<FtnResponse>(this.createEndpoint, formData);
    };

    async update(id: number, formData: FtnFormData): Promise<FtnResponse> {
        return apiClient.put<FtnResponse>(`${this.updateEndpoint}${id}`, formData);
    };

    async patch(id: number, formData: FtnPatchFormData): Promise<FtnResponse> {
        return apiClient.patch<FtnResponse>(`${this.patchEndpoint}${id}`, formData);
    };

    async delete(id: number): Promise<FtnResponse> {
        return apiClient.delete<FtnResponse>(`${this.deleteEndpoint}${id}`);
    };
};

export const ftnService = new FtnService();