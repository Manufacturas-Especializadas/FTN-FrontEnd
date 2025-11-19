import { useEffect, useState } from "react";
import { ftnService, type FtnFormData } from "../api/services/FtnService";
import type { StageEntrance } from "../types/StageEntrance";

interface UseFtnFormProps {
    platform?: StageEntrance | null;
    onSuccess?: () => void;
};

interface UseFtnFormReturn {
    formData: FtnFormData;
    loading: boolean;
    error: string;
    success: string;
    isEditing: boolean;
    partNumbers: string[];
    handleInputChange: (field: keyof FtnFormData, value: string | number) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    addPartNumberField: () => void;
    removePartNumberField: (index: number) => void;
    handlePartNumberChange: (index: number, value: string) => void;
    resetForm: () => void;
};

export const useFtnForm = ({ platform, onSuccess }: UseFtnFormProps): UseFtnFormReturn => {
    const [formData, setFormData] = useState<FtnFormData>({
        folio: "",
        partNumber: "",
        numberOfPieces: 0,
        entryDate: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [partNumbers, setPartNumbers] = useState<string[]>([""]);
    const isEditing = !!platform;

    useEffect(() => {
        if (platform) {
            if (platform.partNumber) {
                const parts = platform.partNumber.split(',').map(p => p.trim()).filter(p => p !== "");
                setPartNumbers(parts.length > 0 ? parts : [""]);
            } else {
                setPartNumbers([""]);
            }

            setFormData({
                folio: platform.folio || "",
                partNumber: platform.partNumber || "",
                numberOfPieces: platform.numberOfPieces || 0,
                entryDate: platform.entryDate || ""
            });
        }
    }, [platform]);

    const handlePartNumberChange = (index: number, value: string) => {
        const newPartNumbers = [...partNumbers];
        newPartNumbers[index] = value;
        setPartNumbers(newPartNumbers);

        const filteredParts = newPartNumbers.filter(part => part.trim() !== "");
        setFormData(prev => ({
            ...prev,
            partNumber: filteredParts.join(",")
        }));

        if (error) setError("");
        if (success) setSuccess("");
    };

    const addPartNumberField = () => {
        setPartNumbers([...partNumbers, ""]);
    };

    const removePartNumberField = (index: number) => {
        if (partNumbers.length > 1) {
            const newPartNumbers = partNumbers.filter((_, i) => i !== index);
            setPartNumbers(newPartNumbers);

            const filteredParts = newPartNumbers.filter(part => part.trim() !== "");
            setFormData(prev => ({
                ...prev,
                partNumber: filteredParts.join(",")
            }));
        }
    };

    const handleInputChange = (field: keyof FtnFormData, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        if (error) setError("");
        if (success) setSuccess("");
    };

    const validateForm = (): boolean => {
        if (!formData.folio?.trim()) {
            setError("El folio es requerido");
            return false;
        }

        const validPartNumbers = partNumbers.filter(part => part.trim() !== "");
        if (validPartNumbers.length === 0) {
            setError("Al menos un número de parte es requerido");
            return false;
        }

        if (!formData.entryDate) {
            setError("La fecha de entrada es requerida");
            return false;
        }

        if (formData.numberOfPieces === 0) {
            setError("La cantidad de tarimas no puede ser 0");
            return false;
        }

        if (formData.numberOfPieces < 0) {
            setError("La cantidad no puede ser negativa");
            return false;
        }

        return true;
    };

    const resetForm = () => {
        setFormData({
            folio: "",
            partNumber: "",
            numberOfPieces: 0,
            entryDate: ""
        });
        setError("");
        setPartNumbers([""]);
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
            const filteredPartNumbers = partNumbers.filter(part => part.trim() !== "");
            const finalPartNumber = filteredPartNumbers.join(",");

            const submitData = {
                ...formData,
                partNumber: finalPartNumber
            };

            let response;

            if (isEditing && platform) {
                response = await ftnService.update(platform.id, submitData);
            } else {
                response = await ftnService.create(submitData);
            }

            if (response.success) {
                const successMessage = isEditing ? "Registro actualizado correctamente" : "Registro guardado correctamente";
                setSuccess(successMessage);

                if (!isEditing) {
                    resetForm();
                }

                setTimeout(() => {
                    onSuccess?.();
                }, 1500);
            } else {
                setError(response.message || `Error al ${isEditing ? 'actualizar' : 'guardar'} el registro`);
            }
        } catch (error: any) {
            console.error(`Error al ${isEditing ? 'actualizar' : 'guardar'}: `, error);

            const errorMessage = error.response?.data?.message
                ? `Error: ${error.response.data.message}`
                : error.message
                    ? `Error: ${error.message}`
                    : `Error desconocido al ${isEditing ? 'actualizar' : 'guardar'} el flete`;

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        loading,
        error,
        success,
        isEditing,
        partNumbers, // Agregué esto al return
        handleInputChange,
        handlePartNumberChange,
        handleSubmit,
        addPartNumberField, // Agregué esto al return
        removePartNumberField, // Agregué esto al return
        resetForm
    };
};