import InputField from "../Inputs/InputField";
import { useFtnForm } from "../../hooks/useFtnForm";
import type { StageEntrance } from "../../types/StageEntrance";

interface Props {
    platform?: StageEntrance | null;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export const FtnForm = ({ platform, onSuccess, onCancel }: Props) => {
    const {
        formData,
        loading,
        error,
        success,
        isEditing,
        handleInputChange,
        partNumbers,
        handlePartNumberChange,
        addPartNumberField,
        removePartNumberField,
        handleSubmit
    } = useFtnForm({ platform, onSuccess });

    const AlertMessage = ({ message, type }: { message: string; type: 'success' | 'error' }) => (
        <div className={`p-3 ${type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border rounded-lg`}>
            <p className={`text-sm ${type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {message}
            </p>
        </div>
    );

    const FormButton = ({
        type,
        onClick,
        children,
        disabled = false
    }: {
        type: 'button' | 'submit';
        onClick?: () => void;
        children: React.ReactNode;
        disabled?: boolean;
    }) => (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2.5 px-4
                        rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 
                        focus:ring-offset-2 hover:cursor-pointer disabled:opacity-50"
        >
            {children}
        </button>
    );

    const SubmitButton = () => (
        <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4
                        rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 
                        focus:ring-offset-2 hover:cursor-pointer disabled:opacity-50"
        >
            {loading
                ? (isEditing ? "Actualizando..." : "Guardando...")
                : (isEditing ? "Actualizar" : "Guardar")
            }
        </button>
    );

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="max-w-md overflow-y-auto space-y-3 px-4">
                {success && <AlertMessage message={success} type="success" />}
                {error && <AlertMessage message={error} type="error" />}

                <InputField
                    label="Folio"
                    type="text"
                    value={formData.folio}
                    onChange={(e) => handleInputChange("folio", e.target.value)}
                    required
                />

                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                        Número de parte
                    </label>

                    {
                        partNumbers.map((partNumber, index) => (
                            <div key={index} className="flex gap-2 items-start">
                                <div className="flex-1">
                                    <InputField
                                        label={index === 0 ? "" : `Número de parte ${index + 1}`}
                                        type="text"
                                        value={partNumber}
                                        onChange={(e) => handlePartNumberChange(index, e.target.value)}
                                        required={index === 0}
                                    />
                                </div>

                                {
                                    partNumbers.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removePartNumberField(index)}
                                            disabled={loading}
                                            className="mt-6 px-3 py-2 text-red-500 hover:text-red-900
                                                        rounded-lg transition-colors disabled:opacity-50 
                                                        hover:cursor-pointer"
                                            title="Eliminar número de parte"
                                        >
                                            ×
                                        </button>
                                    )
                                }
                            </div>
                        ))
                    }

                    <button
                        type="button"
                        onClick={addPartNumberField}
                        disabled={loading}
                        className="flex items-center gap-2 px-3 py-2 text-green-500 hover:text-green-900
                                    rounded-lg transition-colors disabled:opacity-5 hover:cursor-pointer"
                    >
                        <span>+</span>
                        Agregar otro número de parte
                    </button>
                </div>

                <InputField
                    label="Cantidad de piezas"
                    type="number"
                    value={formData.numberOfPieces || ""}
                    onChange={(e) => handleInputChange("numberOfPieces", Number(e.target.value))}
                    min="1"
                    required
                />

                <InputField
                    label="Fecha de entrada"
                    type="datetime-local"
                    value={formData.entryDate}
                    onChange={(e) => handleInputChange("entryDate", e.target.value)}
                    required
                />

                <div className="pt-4 flex gap-3">
                    {onCancel && (
                        <FormButton
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Cancelar
                        </FormButton>
                    )}
                    <SubmitButton />
                </div>
            </div>
        </form>
    );
};