import { useMemo } from "react";
import type { StageEntrance } from "../types/StageEntrance";
import { calculateMetricsPlatform } from "../utils/calculations";

export const usePlatformsMetrics = (data: StageEntrance[] | undefined) => {
    const dataMetrics = useMemo(() => {
        if (!data) return [];


        return data.map(platform => {
            const metrics = calculateMetricsPlatform(platform);

            return {
                ...platform,
                ...metrics
            };
        });
    }, [data]);

    const generalMetrics = useMemo(() => {
        if (!dataMetrics.length) return null;

        const totalStorageCost = dataMetrics.reduce((sum, item) => sum + (item.storageCost || 0), 0);
        const totalCostOfTickets = dataMetrics.reduce((sum, item) => sum + (item.entranceFee || 0), 0);
        const totalCostOutflows = dataMetrics.reduce((sum, item) => sum + (item.costOut || 0), 0);
        const totalGeneralcost = totalStorageCost + totalCostOfTickets + totalCostOutflows;

        return {
            totalStorageCost,
            totalCostOfTickets,
            totalCostOutflows,
            totalGeneralcost,
            averageDaysInWarehouse: dataMetrics.reduce((sum, item) => sum + (item.daysInWarehouse || 0), 0)
        };
    }, [dataMetrics]);

    return {
        dataMetrics,
        generalMetrics
    }
};