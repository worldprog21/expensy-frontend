
export const TableSkeleton = () => {
    return (
        <div
            role="status"
            className="w-full mt-5 mb-5 p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse  md:p-6  "
        >
            <div className="flex items-center justify-between">
                <div>
                    <div className="h-2.5 bg-gray-300 rounded-full   w-24 mb-2.5" />
                    <div className="w-32 h-2 bg-gray-200 rounded-full  " />
                </div>
                <div className="h-2.5 bg-gray-300 rounded-full   w-12" />
            </div>
            <div className="flex items-center justify-between pt-4">
                <div>
                    <div className="h-2.5 bg-gray-300 rounded-full   w-24 mb-2.5" />
                    <div className="w-32 h-2 bg-gray-200 rounded-full  " />
                </div>
                <div className="h-2.5 bg-gray-300 rounded-full   w-12" />
            </div>
            <div className="flex items-center justify-between pt-4">
                <div>
                    <div className="h-2.5 bg-gray-300 rounded-full   w-24 mb-2.5" />
                    <div className="w-32 h-2 bg-gray-200 rounded-full  " />
                </div>
                <div className="h-2.5 bg-gray-300 rounded-full   w-12" />
            </div>
            <div className="flex items-center justify-between pt-4">
                <div>
                    <div className="h-2.5 bg-gray-300 rounded-full   w-24 mb-2.5" />
                    <div className="w-32 h-2 bg-gray-200 rounded-full  " />
                </div>
                <div className="h-2.5 bg-gray-300 rounded-full   w-12" />
            </div>
            <div className="flex items-center justify-between pt-4">
                <div>
                    <div className="h-2.5 bg-gray-300 rounded-full   w-24 mb-2.5" />
                    <div className="w-32 h-2 bg-gray-200 rounded-full  " />
                </div>
                <div className="h-2.5 bg-gray-300 rounded-full   w-12" />
            </div>
            <span className="sr-only">Loading...</span>
        </div>
    );
};
