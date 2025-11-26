import { API_CONFIG } from "../../config/api";
import type { SearchResult } from "../../hooks/useFtnExitForm";
import type { ReportItem } from "../../hooks/useMonthlyReports";
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

export interface FolioSearchResponse {
    folioResults: FolioSearch[];
    accumulatedPartNumbers: Array<{
        partNumber: string;
        totalQuantity: number;
    }>;
}

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
    partNumbers: string;
    pallets: number;
    entryDate: string;
    exitDate: string;
    daysInStorage: number;
    entranceCost: number;
    exitCost: number;
    storageCost: number;
    totalCost: number;
};

export interface FolioSearch {
    folio: number;
    entrances: FolioEntrance[];
    totalPlatforms: number;
    totalPieces: number;
};

export interface FolioEntrance {
    folio: number;
    platforms: number;
    totalPieces: number;
    entryDate: string;
    exitDate?: string;
    partNumbers: Array<{
        partNumber: string;
        quantity: number;
    }>
};

export interface ReportRequest {
    year: number;
    month: number;
};

class FtnService {
    private getStageEntranceEndpoint = API_CONFIG.endpoints.ftn.getStageEntrance;
    private availableReportsEndpoint = API_CONFIG.endpoints.ftn.avaibleReports;
    private searchByPartNumberEndpoint = API_CONFIG.endpoints.ftn.searchByPartNumber;
    private searchByFolioEndpoint = API_CONFIG.endpoints.ftn.serchByFolio;
    private downloadReportEndpoint = API_CONFIG.endpoints.ftn.downloadReport;
    private processExitsEndpoint = API_CONFIG.endpoints.ftn.processExits;
    private createEndpoint = API_CONFIG.endpoints.ftn.create;
    private updateEndpoint = API_CONFIG.endpoints.ftn.update;
    private patchEndpoint = API_CONFIG.endpoints.ftn.patch;
    private deleteEndpoint = API_CONFIG.endpoints.ftn.delete;

    async getStageEntrance(): Promise<StageEntrance[]> {
        return apiClient.get<StageEntrance[]>(this.getStageEntranceEndpoint);
    };

    async avaibleReports(): Promise<ReportItem[]> {
        return apiClient.get<ReportItem[]>(this.availableReportsEndpoint);
    };

    async searchByPartNumber(partNumber: string): Promise<SearchResult[]> {
        return apiClient.get<SearchResult[]>(`${this.searchByPartNumberEndpoint}${encodeURIComponent(partNumber)}`);
    };

    async searchByFolio(folio: number): Promise<FolioSearchResponse> {
        return apiClient.get<FolioSearchResponse>(`${this.searchByFolioEndpoint}${folio}`);
    };

    async downloadMonthlyReport(year: number, month: number): Promise<void> {
        const endpoint = `${this.downloadReportEndpoint}${year}/${month}`;
        const monthName = new Date(year, month - 1).toLocaleString('es-MX', { month: 'long' });
        const filename = `Reporte_Mensual_${monthName}_${year}.xlsx`;

        return apiClient.downloadFile(endpoint, filename);
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