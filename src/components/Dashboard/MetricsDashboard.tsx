import { usePlatformsMetrics } from "../../hooks/usePlatformsMetrics";
import { useStageEntrance } from "../../hooks/useStageEntrance";
import { formatCurrency } from "../../utils/calculations";

export const MetricsDashboard = () => {
    const { data } = useStageEntrance();
    const { generalMetrics } = usePlatformsMetrics(data);

    const MetricCard = ({ title, value, icon, color, isCurrency = false }: any) => (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                        {isCurrency ? formatCurrency(value) : value.toLocaleString()}
                    </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    color === 'green' ? 'bg-green-100 text-green-600' :
                        color === 'purple' ? 'bg-purple-100 text-purple-600' :
                            'bg-orange-100 text-orange-600'
                    }`}>
                    {icon}
                </div>
            </div>
        </div>
    );

    if (!generalMetrics) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
                title="Costo total almacén"
                value={generalMetrics.totalStorageCost}
                icon="💰"
                color="blue"
                isCurrency={true}
            />
            <MetricCard
                title="Costo Total Entradas"
                value={generalMetrics.totalCostOfTickets}
                icon="📥"
                color="green"
                isCurrency={true}
            />
            <MetricCard
                title="Costo Total Salidas"
                value={generalMetrics.totalCostOutflows}
                icon="📤"
                color="purple"
                isCurrency={true}
            />
            <MetricCard
                title="Promedio Días/Almacén"
                value={Math.round(generalMetrics.averageDaysInWarehouse)}
                icon="📅"
                color="orange"
                suffix="días"
            />
        </div>
    );
};