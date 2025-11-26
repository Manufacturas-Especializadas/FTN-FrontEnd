import { useState, useEffect } from 'react';
import { ftnService } from '../api/services/FtnService';

export interface ReportItem {
    year: number;
    month: number;
    monthName: string;
};

export const useMonthlyReports = () => {
    const [reports, setReports] = useState<ReportItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                const data = await ftnService.avaibleReports();
                setReports(data);
            } catch (error: any) {
                setError("Error al obtener los reportes disponibles");
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    return { reports, loading, error };
};