import { useFtnExitForm } from "../../hooks/useFtnExitForm";
import type { StageEntrance } from "../../types/StageEntrance";
import InputField from "../Inputs/InputField";

interface Props {
    platform: StageEntrance;
    onSuccess?: () => void;
    onCancel?: () => void;
};

export const FtnExitForm = ({ platform, onSuccess, onCancel }: Props) => {
    const {
        formData,
        loading,
        error,
        success,
        handleInputChange,
        handleSubmit,
    } = useFtnExitForm({ platform, onSuccess });

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
            className="flex bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4
                rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500
                focus:ring-offset-2 hover:cursor-pointer disabled:opacity-50"
        >
            {loading ? "Registrando salida..." : "Registrar salida"}
        </button>
    );

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="max-w-md overflow-y-auto space-y-3 px-4">
                {success && <AlertMessage message={success} type="success" />}
                {error && <AlertMessage message={error} type="error" />}

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="text-sm font-medium text-blue-800 mb-2">
                        Información del registro
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                            <span className="font-medium text-blue-700">
                                Folio:
                            </span>
                            <p className="text-blue-600">{platform.folio}</p>
                        </div>
                        <div>
                            <span className="font-medium text-blue-700">
                                No.Parte
                            </span>
                            <p className="text-blue-600">{platform.partNumber}</p>
                        </div>
                        <div>
                            <span className="font-medium text-blue-700">
                                Tarimas disponibles:
                            </span>
                            <p className="text-blue-600">{platform.platforms}</p>
                        </div>
                        <div>
                            <span className="font-medium text-blue-700">
                                Fecha entrada:
                            </span>
                            <p className="text-blue-600">
                                {new Date(platform.entryDate).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                <InputField
                    label="Cantidad de tarimas"
                    type="number"
                    value={formData.exitPlatforms}
                    onChange={(e) => handleInputChange("exitPlatforms", Number(e.target.value))}
                    max={platform.platforms}
                    required
                />

                <InputField
                    label="Fecha de salida"
                    type="datetime-local"
                    value={formData.exitDate}
                    onChange={(e) => handleInputChange("exitDate", e.target.value)}
                    required
                />

                <div className="pt-4 flex gap-3">
                    {
                        onCancel && (
                            <FormButton
                                type="button"
                                onClick={onCancel}
                                disabled={loading}
                            >
                                Cancelar
                            </FormButton>
                        )
                    }
                    <SubmitButton />
                </div>
            </div>
        </form>
    );
};