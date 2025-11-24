import { useState } from "react";

interface Filters {
    folio: string;
    partNumber: string;
    startDate: string;
    endDate: string;
};

export const AdvancedFilters = ({ onFilter }: { onFilter: (filters: Filters) => void }) => {
    const [filters, setFilters] = useState<Filters>({
        folio: "",
        partNumber: "",
        startDate: "",
        endDate: ""
    });

    const handleFilterChange = (field: keyof Filters, value: string) => {
        const newFilters = { ...filters, [field]: value };
        setFilters(newFilters);
        onFilter(newFilters);
    };

    const clearFilters = () => {
        const clearedFilters: Filters = {
            folio: "",
            partNumber: "",
            startDate: "",
            endDate: ""
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <input
                    type="text"
                    placeholder="Buscar por folio..."
                    value={filters.folio}
                    onChange={(e) => handleFilterChange("folio", e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                    type="text"
                    placeholder="Buscar por número de parte..."
                    value={filters.partNumber}
                    onChange={(e) => handleFilterChange("partNumber", e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>
    );
};