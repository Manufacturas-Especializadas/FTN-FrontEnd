import { useState } from "react";
import { ftnService } from "../api/services/FtnService";

export function useReportByDateRange() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const getReportByDateRange = async (startDate: string, endDate: string) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            const start = new Date(startDate);
            const end = new Date(endDate);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                throw new Error("Formato de fecha inválido");
            }

            if (start > end) {
                throw new Error("La fecha inicial no puede ser mayor que la final");
            }

            await ftnService.downloadReportByDateRange(startDate, endDate);
            setSuccess(true);

        } catch (error: any) {
            console.error("Error generating report:", error);
            const errorMessage = error.response?.data?.message ||
                error.message ||
                "Error al generar el reporte";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const resetState = () => {
        setError(null);
        setSuccess(false);
        setLoading(false);
    };

    return {
        loading,
        error,
        success,
        getReportByDateRange,
        resetState
    }
}