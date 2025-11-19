import { Route, Routes } from "react-router-dom";
import { FtnIndex } from "../pages/Ftn/FtnIndex";
import { MonthlyReport } from "../pages/MonthlyReport/MonthlyReport";

export const MyRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<FtnIndex />} />

            <Route path="/reporte-mensual" element={<MonthlyReport />} />
        </Routes>
    );
};