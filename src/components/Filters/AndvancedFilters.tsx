import { useState } from "react";
import InputField from "../Inputs/InputField";

interface Filters {
    folio: string;
    partNumber: string;
};

export const AdvancedFilters = ({ onFilter }: { onFilter: (filters: Filters) => void }) => {
    const [filters, setFilters] = useState<Filters>({
        folio: "",
        partNumber: ""
    });

    const handleFilterChange = (field: keyof Filters, value: string) => {
        const newFilters = { ...filters, [field]: value };
        setFilters(newFilters);
        onFilter(newFilters);
    };

    const clearFilters = () => {
        const clearedFilters: Filters = {
            folio: "",
            partNumber: ""
        };
        setFilters(clearedFilters);
        onFilter(clearedFilters);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    Filtros
                </h3>
                <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:cursor-pointer"
                >
                    Limpiar filtros
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                <InputField
                    type="text"
                    label="Buscar por folio"
                    value={filters.folio}
                    onChange={(e => handleFilterChange("folio", e.target.value))}
                />

                <InputField
                    type="text"
                    label="Buscar por número de parte"
                    onChange={(e) => handleFilterChange("partNumber", e.target.value)}
                />

            </div>
        </div>
    );
};