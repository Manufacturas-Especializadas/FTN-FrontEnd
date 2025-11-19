import type { StageEntrance } from "../types/StageEntrance";

export const COSTOS = {
    ALMACENAJE_POR_DIA: 133,
    ENTRADA: 67.50,
    SALIDA: 67.50
};

export const calculateMetricsPlatform = (platform: StageEntrance) => {
    const entryDate = new Date(platform.entryDate);
    const departureDate = platform.exitDate ? new Date(platform.exitDate) : new Date();
    // const today = new Date();

    const diffTime = Math.abs(departureDate.getTime() - entryDate.getTime());
    const daysInWarehouse = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const entranceFee = COSTOS.ENTRADA;
    const costOut = platform.exitDate ? COSTOS.SALIDA : 0;
    const storageCost = daysInWarehouse * COSTOS.ALMACENAJE_POR_DIA;
    const totalCost = entranceFee + costOut + storageCost;

    return {
        daysInWarehouse,
        storageCost,
        entranceFee,
        costOut,
        totalCost
    };
};

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-Mx", {
        style: "currency",
        currency: "MXN"
    }).format(amount);
};