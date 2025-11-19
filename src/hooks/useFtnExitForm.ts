import type React from "react";
import type { StageEntrance } from "../types/StageEntrance";
import { useState } from "react";
import { ftnService, type FtnPatchFormData } from "../api/services/FtnService";


interface UseFtnExitFormProps {
    platform: StageEntrance;
    onSuccess?: () => void;
};

interface UseFtnExitFormReturn {
    formData: {
        exitPlatforms: number;
        exitDate: string;
    };
    loading: boolean;
    error: string;
    success: string;
    handleInputChange: (field: keyof { exitPlatforms: number; exitDate: string }, value: string | number) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    resetForm: () => void;
};

export const useFtnExitForm = ({ platform, onSuccess }: UseFtnExitFormProps): UseFtnExitFormReturn => {
    const [formData, setFormData] = useState({
        exitPlatforms: platform.platforms || 0,
        exitDate: new Date().toISOString().slice(0, 16)
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleInputChange = (field: keyof { exitPlatforms: number; exitDate: string }, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setError("");
        setSuccess("");
    };

    const validateForm = (): boolean => {
        if (formData.exitPlatforms < 0) {
            setError("La cantidad de tarimas no puede ser negativa");
            return false;
        }

        if (formData.exitPlatforms > platform.platforms) {
            setError(`La cantidad de salida no puede ser mayor a ${platform.platforms}(cantidad disponible)`);
            return false;
        }

        if (!formData.exitDate) {
            setError("La fecha de salida es requerida");
            return false;
        }

        return true;
    };

    const resetForm = () => {
        setFormData({
            exitPlatforms: platform.platforms || 0,
            exitDate: new Date().toISOString().slice(0, 16)
        });
        setError("");
        setSuccess("");
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const patchData: FtnPatchFormData = {
                platforms: formData.exitPlatforms,
                exitDate: new Date(formData.exitDate).toISOString()
            };

            const response = await ftnService.patch(platform.id, patchData);

            if (response.success) {
                setSuccess("Salida registrada correctamente");

                setTimeout(() => {
                    onSuccess?.();
                }, 1500);
            } else {
                setError(response.message || "Error al registrar la salida");
            }
        } catch (error: any) {
            console.error("Error al registrar la salida: ", error);
            const errorMessage = error.response?.data?.message
                ? `Error: ${error.response.data.message}`
                : error.message
                    ? `Error: ${error.message}`
                    : "Error desconocido al registrar la salida";

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    return {
        formData,
        loading,
        error,
        success,
        handleInputChange,
        handleSubmit,
        resetForm
    }
};