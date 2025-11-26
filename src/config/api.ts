const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error("API base URL is not defined in environment variables");
}

export const API_CONFIG = {
    baseUrl: API_BASE_URL,
    endpoints: {
        ftn: {
            getStageEntrance: "/api/StageEntrance/GetStageEntrances",
            avaibleReports: "/api/StageEntrance/Available-Reports",
            searchByPartNumber: "/api/StageEntrance/SearchByPartNumber/",
            serchByFolio: "/api/StageEntrance/SearchByFolio/",
            downloadReport: "/api/StageEntrance/DownloadMonthlyReport/",
            processExits: "/api/StageEntrance/ProcessExits",
            create: "/api/StageEntrance/Create",
            update: "/api/StageEntrance/Update/",
            patch: "/api/StageEntrance/UpdateExits/",
            delete: "/api/StageEntrance/Delete/"
        }
    }
};