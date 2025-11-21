import { API_CONFIG } from "../../config/api";
import type { SearchResult } from "../../hooks/useStageExits";
import type { StageEntrance } from "../../types/StageEntrance";
import { apiClient } from "../client";

export interface PartNumberDto {
    partNumber: string;
    quantity: number;
}

export interface FtnFormData {
    folio: number;
    entryDate: string;
    partNumbers: PartNumberDto[];
};

export interface FtnPatchFormData {
    platforms: number;
    exitDate: string;
};

export interface FtnResponse {
    success?: boolean;
    message?: string;
    idStageEntrances?: number;
    IdModified?: number;
};

export interface ProcessExitsRequest {
    ExitItem: Array<{
        folio: number;
        partNumber: string;
        quantity: number;
    }>;
}

export interface ProcessExitsResponse {
    success: boolean;
    message: string;
    results: Array<{
        folio: string;
        success: boolean;
        message: string;
        previousPlatforms: number;
        currentPlatforms: number;
    }>;
    exitDate: string;
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
    folio: number;
    partNumber: string;
    pallets: number;
    entryDate: string;
    exitDate?: string;
    daysInStorage: number;
    entryCost: number;
    exitCost: number;
    storageCost: number;
    totalCost: number;
};

class FtnService {
    private getStageEntranceEndpoint = API_CONFIG.endpoints.ftn.getStageEntrance;
    private searchByPartNumberEndpoint = API_CONFIG.endpoints.ftn.searchByPartNumber;
    private processExitsEndpoint = API_CONFIG.endpoints.ftn.processExits;
    private createEndpoint = API_CONFIG.endpoints.ftn.create;
    private updateEndpoint = API_CONFIG.endpoints.ftn.update;
    private patchEndpoint = API_CONFIG.endpoints.ftn.patch;
    private deleteEndpoint = API_CONFIG.endpoints.ftn.delete;

    async getStageEntrance(): Promise<StageEntrance[]> {
        return apiClient.get<StageEntrance[]>(this.getStageEntranceEndpoint);
    };

    async searchByPartNumber(partNumber: string): Promise<SearchResult[]> {
        return apiClient.get<SearchResult[]>(`${this.searchByPartNumberEndpoint}${encodeURIComponent(partNumber)}`);
    };

    async processExits(exitItems: Array<{ folio: number; partNumber: string; quantity: number }>): Promise<ProcessExitsResponse> {
        const request: ProcessExitsRequest = {
            ExitItem: exitItems
        };

        return apiClient.post<ProcessExitsResponse>(this.processExitsEndpoint, request);
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