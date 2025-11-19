import { useEffect, useState } from "react"
import type { StageEntrance } from "../types/StageEntrance"
import { ftnService } from "../api/services/FtnService";

export const useStageEntrance = () => {
    const [data, setData] = useState<StageEntrance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await ftnService.getStageEntrance();
            setData(response);
        } catch (error: any) {
            setError(error instanceof Error ? error.message : "Error al cargar los datos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    return {
        data,
        loading,
        error,
        refetch: fetchData
    };
};