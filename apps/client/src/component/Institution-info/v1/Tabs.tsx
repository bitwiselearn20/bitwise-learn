type TabsProps = {
    value: string;
    onValueChange: (value: string) => void;
};

export const Tabs = ({ value, onValueChange }: TabsProps) => {
    const tabs = ["Teachers", "Batches", "Vendors", "Courses"];

    return (
        <div className="flex gap-4 mb-5 mt-5">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => onValueChange(tab)}
                    className={`px-4 py-1.5 rounded-md text-md ${value === tab
                        ? "bg-blue-500 text-white"
                        : "text-gray-400 hover:text-white"
                        }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};
