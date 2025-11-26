import React, { useState, useEffect } from "react";
import { useReportByDateRange } from "../../hooks/useReportByDateRange";
import InputField from "../Inputs/InputField";
import FormButton from "../Inputs/FormButton";

export const ReportByDateForm = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [localError, setLocalError] = useState("");

    const { loading, error, success, getReportByDateRange, resetState } = useReportByDateRange();

    useEffect(() => {
        return () => {
            resetState();
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError("");

        if (!startDate || !endDate) {
            setLocalError("Ambas fechas son requeridas");
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        if (startDate > today || endDate > today) {
            setLocalError("Las fechas no pueden ser futuras");
            return;
        }

        getReportByDateRange(startDate, endDate);
    };

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(e.target.value);
        setLocalError("");
        resetState();
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(e.target.value);
        setLocalError("");
        resetState();
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <InputField
                label="Fecha inicial"
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                max={new Date().toISOString().split('T')[0]}
                required
            />

            <InputField
                label="Fecha final"
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                min={startDate}
                max={new Date().toISOString().split('T')[0]}
                required
            />

            <FormButton disabled={loading} type="submit">
                {loading ? "Generando reporte..." : "Generar reporte"}
            </FormButton>

            {localError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">{localError}</p>
                </div>
            )}

            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-600 text-sm">
                        ✅ Reporte generado exitosamente. La descarga comenzará automáticamente.
                    </p>
                </div>
            )}
        </form>
    );
};