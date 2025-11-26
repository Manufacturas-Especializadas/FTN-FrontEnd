import { useMonthlyReports } from '../../hooks/useMonthlyReports';
import { useDownloadReport } from '../../hooks/useDownloadReport';

export const ReportsTable = () => {
    const { reports, loading, error: reportsError } = useMonthlyReports();
    const { downloading, error: downloadError, downloadReport, clearError } = useDownloadReport();

    const handleDownload = async (year: number, month: number) => {
        await downloadReport(year, month);
    };

    const error = reportsError || downloadError;

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <div className="ml-3 text-gray-500">Cargando reportes disponibles...</div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">
                    Reportes Mensuales Disponibles
                </h2>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg m-4">
                    <div className="flex justify-between items-start">
                        <p className="text-red-800 text-sm">{error}</p>
                        <button
                            onClick={clearError}
                            className="text-red-600 hover:text-red-800 ml-4"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Mes
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Año
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {reports.map((report) => (
                            <tr
                                key={`${report.year}-${report.month}`}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {report.monthName}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600">{report.year}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => handleDownload(report.year, report.month)}
                                        disabled={downloading === report.month}
                                        className={`
                                            inline-flex items-center px-4 py-2 border border-transparent 
                                            text-sm font-medium rounded-md shadow-sm text-white
                                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                                            transition-colors duration-200 hover:cursor-pointer
                                            ${downloading === report.month
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-blue-600 hover:bg-blue-700"
                                            }
                                        `}
                                    >
                                        {downloading === report.month ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Descargando...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                Descargar Excel
                                            </>
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {reports.length === 0 && !loading && (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center">
                                    <div className="text-gray-500">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p className="mt-2">No hay reportes disponibles</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                    Mostrando {reports.length} reportes de los últimos 12 meses
                </p>
            </div>
        </div>
    );
};