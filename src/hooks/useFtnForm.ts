import { useEffect, useState } from "react";
import { ftnService, type FtnFormData } from "../api/services/FtnService";
import type { StageEntrance } from "../types/StageEntrance";

interface PartNumberWithQuantity {
    partNumber: string;
    quantity: number;
}

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
    partNumbers: PartNumberWithQuantity[];
    handleInputChange: (field: keyof FtnFormData, value: string | number) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    addPartNumberField: () => void;
    removePartNumberField: (index: number) => void;
    handlePartNumberChange: (index: number, value: string) => void;
    handleQuantityChange: (index: number, value: number) => void;
    resetForm: () => void;
};

export const useFtnForm = ({ platform, onSuccess }: UseFtnFormProps): UseFtnFormReturn => {
    const [formData, setFormData] = useState<FtnFormData>({
        folio: 0,
        entryDate: "",
        partNumbers: []
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [partNumbers, setPartNumbers] = useState<PartNumberWithQuantity[]>([{ partNumber: "", quantity: 0 }]);
    const isEditing = !!platform;

    useEffect(() => {
        if (platform) {
            if (platform.partNumbers && platform.partNumbers.length > 0) {
                const parts = platform.partNumbers.map(pn => ({
                    partNumber: pn.partNumber,
                    quantity: pn.quantity
                }));
                setPartNumbers(parts);
            } else {
                const parts: PartNumberWithQuantity[] = [{ partNumber: "", quantity: 0 }];
                setPartNumbers(parts);
            }

            setFormData({
                folio: platform.folio || 0,
                entryDate: platform.entryDate || "",
                partNumbers: platform.partNumbers || []
            });
        }
    }, [platform]);

    const handlePartNumberChange = (index: number, value: string) => {
        const newPartNumbers = [...partNumbers];
        newPartNumbers[index] = { ...newPartNumbers[index], partNumber: value };
        setPartNumbers(newPartNumbers);

        const filteredParts = newPartNumbers.filter(part => part.partNumber.trim() !== "");

        setFormData(prev => ({
            ...prev,
            partNumbers: filteredParts
        }));

        if (error) setError("");
        if (success) setSuccess("");
    };

    const handleQuantityChange = (index: number, value: number) => {
        const newPartNumbers = [...partNumbers];
        newPartNumbers[index] = { ...newPartNumbers[index], quantity: value };
        setPartNumbers(newPartNumbers);

        const filteredParts = newPartNumbers.filter(part => part.partNumber.trim() !== "");

        setFormData(prev => ({
            ...prev,
            partNumbers: filteredParts
        }));

        if (error) setError("");
        if (success) setSuccess("");
    };

    const addPartNumberField = () => {
        setPartNumbers([...partNumbers, { partNumber: "", quantity: 0 }]);
    };

    const removePartNumberField = (index: number) => {
        if (partNumbers.length > 1) {
            const newPartNumbers = partNumbers.filter((_, i) => i !== index);
            setPartNumbers(newPartNumbers);

            const filteredParts = newPartNumbers.filter(part => part.partNumber.trim() !== "");

            setFormData(prev => ({
                ...prev,
                partNumbers: filteredParts
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
        if (!formData.folio || formData.folio <= 0) {
            setError("El folio es requerido y debe ser mayor a 0");
            return false;
        }

        const validPartNumbers = partNumbers.filter(part => part.partNumber.trim() !== "");
        if (validPartNumbers.length === 0) {
            setError("Al menos un número de parte es requerido");
            return false;
        }

        for (const part of validPartNumbers) {
            if (part.quantity <= 0) {
                setError(`La cantidad para el número de parte "${part.partNumber}" debe ser mayor a 0`);
                return false;
            }
        }

        if (!formData.entryDate) {
            setError("La fecha de entrada es requerida");
            return false;
        }

        const totalQuantity = validPartNumbers.reduce((sum, part) => sum + part.quantity, 0);
        if (totalQuantity === 0) {
            setError("La cantidad total de piezas no puede ser 0");
            return false;
        }

        return true;
    };

    const resetForm = () => {
        setFormData({
            folio: 0,
            entryDate: "",
            partNumbers: []
        });
        setError("");
        setPartNumbers([{ partNumber: "", quantity: 0 }]);
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
            const filteredPartNumbers = partNumbers.filter(part => part.partNumber.trim() !== "");
            const submitData = {
                ...formData,
                partNumbers: filteredPartNumbers
            };

            let response;

            if (isEditing && platform?.id) {
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
                    : `Error desconocido al ${isEditing ? 'actualizar' : 'guardar'} el registro`;

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
        partNumbers,
        handleInputChange,
        handlePartNumberChange,
        handleQuantityChange,
        handleSubmit,
        addPartNumberField,
        removePartNumberField,
        resetForm
    };
};