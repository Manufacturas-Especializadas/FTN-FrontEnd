
export const Loading = () => {
    return (
        <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, index) => (
                <div key={index} className="flex space-x-4">
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};