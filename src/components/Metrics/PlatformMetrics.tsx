// import type { StageEntrance } from "../../types/StageEntrance";
// import { formatCurrency } from "../../utils/calculations";

// interface Props {
//     platform: StageEntrance;
// };

// export const PlatformMetrics = ({ platform }: Props) => {

//     const metrics = {
//         daysInWarehouse: platform.daysInWarehouse || 0,
//         storageCost: platform.storageCost || 0,
//         inboundCost: platform.entranceFee || 0,
//         outboundCost: platform.coustOut || 0,
//         totalCost: platform.totalCost || 0
//     };

//     return (
//         <div className="text-xs space-y-1">
//             <div className="flex justify-between">
//                 <span className="text-gray-500">Días en almacén:</span>
//                 <span className="font-medium">{metrics.daysInWarehouse}</span>
//             </div>

//             <div className="flex justify-between">
//                 <span className="">Costo almacén:</span>
//                 <span>{formatCurrency(metrics.storageCost)}</span>
//             </div>

//             <div className="flex justify-between">
//                 <span className="text-gray-500">Costo entrada:</span>
//                 <span className="font-medium">{formatCurrency(metrics.inboundCost)}</span>
//             </div>
//             {
//                 platform.exitDate && (
//                     <div className="flex justify-between">
//                         <span className="text-gray-500">Costo salida:</span>
//                         <span className="font-medium">{formatCurrency(metrics.outboundCost)}</span>
//                     </div>
//                 )
//             }
//             <div className="flex justify-between border-t border-gray-200 pt-1">
//                 <span className="text-gray-700 font-medium">Total:</span>
//                 <span className="text-blue-600 font-bold">{formatCurrency(metrics.totalCost)}</span>
//             </div>
//         </div>
//     );
// };