"use client";

import { useEffect, useState, useMemo } from "react";
import { X } from "lucide-react";
import { getAllTeachers } from "@/api/teachers/get-all-teachers";
import { getAllBatches } from "@/api/batches/get-all-batches";
import { getAllVendors } from "@/api/vendors/get-all-vendors";

type EntityListProps = {
    type: string;
    institutionId?: string;
};

export const EntityList = ({ type, institutionId }: EntityListProps) => {
    const [entities, setEntities] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedEntity, setSelectedEntity] = useState<any | null>(null);

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                switch (type) {
                    case "Teachers":
                        await getAllTeachers((data: any) => {
                            setEntities(Array.isArray(data) ? data : []);
                        });
                        break;
                    case "Batches":
                        await getAllBatches((data: any) => {
                            setEntities(Array.isArray(data) ? data : []);
                        });
                        break;
                    case "Vendors":
                        await getAllVendors((data: any) => {
                            setEntities(Array.isArray(data) ? data : []);
                        });
                        break;
                    case "Courses":
                        // TODO: Add courses API when available
                        setEntities([]);
                        break;
                    default:
                        setEntities([]);
                }
            } catch (error) {
                console.error(`Error fetching ${type}:`, error);
                setEntities([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [type]);

    const filteredEntities = useMemo(() => {
        // Ensure entities is always an array
        const safeEntities = Array.isArray(entities) ? entities : [];
        
        if (!searchQuery) return safeEntities;
        
        return safeEntities.filter((entity) => {
            switch (type) {
                case "Teachers":
                    return (
                        entity.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        entity.email?.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                case "Batches":
                    return (
                        entity.batchname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        entity.branch?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        entity.batchEndYear?.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                case "Vendors":
                    return (
                        entity.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        entity.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        entity.tagline?.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                case "Courses":
                    return (
                        entity.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        entity.description?.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                default:
                    return true;
            }
        });
    }, [entities, searchQuery, type]);

    const getInitials = (name: string) => {
        if (!name) return "??";
        const parts = name.trim().split(" ");
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const getDisplayName = (entity: any) => {
        switch (type) {
            case "Teachers":
                return entity.name || "Unknown";
            case "Batches":
                return entity.batchname || "Unknown Batch";
            case "Vendors":
                return entity.name || "Unknown Vendor";
            case "Courses":
                return entity.name || "Unknown Course";
            default:
                return "Unknown";
        }
    };

    const getSubtitle = (entity: any) => {
        switch (type) {
            case "Teachers":
                return entity.email;
            case "Batches":
                return `${entity.branch || ""} • ${entity.batchEndYear || ""}`.trim();
            case "Vendors":
                return entity.tagline || entity.email;
            case "Courses":
                return entity.instructorName || entity.description;
            default:
                return "";
        }
    };

    const getEntityKey = (entity: any) => {
        return entity.id || entity._id || Math.random().toString();
    };

    const formatDate = (date?: string) => {
        if (!date) return "—";
        return new Date(date).toLocaleDateString();
    };

    const formatValue = (value: any) => {
        if (value === null || value === undefined) return "—";
        if (typeof value === "string" && value.includes("T")) {
            const date = new Date(value);
            if (!isNaN(date.getTime())) return date.toLocaleString();
        }
        return String(value);
    };

    const getTableHeaders = () => {
        switch (type) {
            case "Teachers":
                return ["Name", "Email", "Phone", "Created"];
            case "Batches":
                return ["Batch Name", "Branch", "End Year", "Created"];
            case "Vendors":
                return ["Name", "Email", "Tagline", "Created"];
            case "Courses":
                return ["Name", "Instructor", "Level", "Created"];
            default:
                return ["Name", "Created"];
        }
    };

    const getTableCells = (entity: any) => {
        switch (type) {
            case "Teachers":
                return [
                    entity.name || "Unknown",
                    entity.email || "—",
                    entity.phoneNumber || "—",
                    formatDate(entity.createdAt),
                ];
            case "Batches":
                return [
                    entity.batchname || "Unknown Batch",
                    entity.branch || "—",
                    entity.batchEndYear || "—",
                    formatDate(entity.createdAt),
                ];
            case "Vendors":
                return [
                    entity.name || "Unknown Vendor",
                    entity.email || "—",
                    entity.tagline || "—",
                    formatDate(entity.createdAt),
                ];
            case "Courses":
                return [
                    entity.name || "Unknown Course",
                    entity.instructorName || "—",
                    entity.level || "—",
                    formatDate(entity.createdAt),
                ];
            default:
                return [
                    getDisplayName(entity),
                    formatDate(entity.createdAt),
                ];
        }
    };

    return (
        <>
            <div className="rounded-xl p-4 mr-4">
                <input
                    placeholder={`Search for ${type.toLowerCase()}`}
                    className="w-full mb-4 bg-[#141414] border border-gray-700 rounded-md px-3 py-2 text-sm text-white outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                {loading ? (
                    <div className="py-12 text-center text-sm text-white/50">
                        Loading...
                    </div>
                ) : !filteredEntities || filteredEntities.length === 0 ? (
                    <div className="py-12 text-center text-sm text-white/50">
                        {searchQuery 
                            ? `No ${type.toLowerCase()} found` 
                            : `No ${type.toLowerCase()} available`}
                    </div>
                ) : (
                    <div className="w-full overflow-x-auto border border-white/10 bg-divBg shadow-lg">
                        <table className="w-full border-collapse">
                            <thead className="bg-black/30">
                                <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-white/40">
                                    {getTableHeaders().map((header) => (
                                        <th key={header} className="px-6 py-4">
                                            {header}
                                        </th>
                                    ))}
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredEntities.map((entity) => {
                                    const cells = getTableCells(entity);
                                    return (
                                        <tr
                                            key={getEntityKey(entity)}
                                            className="text-sm text-white transition-colors hover:bg-primaryBlue/10"
                                        >
                                            {cells.map((cell, index) => (
                                                <td
                                                    key={index}
                                                    className={`px-6 py-4 ${
                                                        index === 0 ? "font-medium" : ""
                                                    } ${
                                                        index === cells.length - 1
                                                            ? "text-white/60"
                                                            : index === 0
                                                            ? ""
                                                            : "text-white/70 truncate"
                                                    }`}
                                                >
                                                    {cell}
                                                </td>
                                            ))}
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => setSelectedEntity(entity)}
                                                    className="rounded-md border border-primaryBlue/40 px-3 py-1.5 text-xs font-medium text-primaryBlue transition hover:bg-primaryBlue/20"
                                                >
                                                    See details
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Details Modal */}
            {selectedEntity && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-divBg p-6 shadow-2xl">
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedEntity(null)}
                            className="absolute right-4 top-4 text-white/50 transition hover:text-white"
                        >
                            <X size={20} />
                        </button>

                        {/* Header */}
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-white">
                                {type} Details
                            </h2>
                            <p className="mt-1 text-sm text-white/40">
                                ID: {selectedEntity.id || selectedEntity._id || "N/A"}
                            </p>
                        </div>

                        {/* Content */}
                        <div className="grid max-h-[60vh] grid-cols-1 gap-x-6 gap-y-5 overflow-y-auto pr-2 sm:grid-cols-2">
                            {Object.entries(selectedEntity)
                                .filter(([key]) => key !== "id" && key !== "_id")
                                .map(([key, value]) => (
                                    <div key={key}>
                                        <p className="my-3 text-[11px] uppercase tracking-wide text-primaryBlue">
                                            {key.replace(/_/g, " ")}
                                        </p>
                                        <p className="break-words text-sm text-white">
                                            {formatValue(value)}
                                        </p>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};