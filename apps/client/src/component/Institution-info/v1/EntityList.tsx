"use client";

import { useEffect, useState, useMemo } from "react";
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

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                switch (type) {
                    case "Teachers":
                        await getAllTeachers(setEntities);
                        break;
                    case "Batches":
                        await getAllBatches(setEntities);
                        break;
                    case "Vendors":
                        await getAllVendors(setEntities);
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
        if (!searchQuery) return entities;
        return entities.filter((entity) => {
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

    return (
        <div className="bg-[#1f1f1f] rounded-xl p-4 mr-4">
            <input
                placeholder={`Search for ${type.toLowerCase()}`}
                className="w-full mb-4 bg-[#141414] border border-gray-700 rounded-md px-3 py-2 text-sm text-white outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="divide-y divide-gray-700">
                {loading ? (
                    <p className="text-center text-gray-400 py-4">Loading...</p>
                ) : filteredEntities.length === 0 ? (
                    <p className="text-center text-gray-400 py-4">
                        {searchQuery 
                            ? `No ${type.toLowerCase()} found` 
                            : `No ${type.toLowerCase()} available`}
                    </p>
                ) : (
                    filteredEntities.map((entity) => (
                        <div
                            key={getEntityKey(entity)}
                            className="flex items-center gap-3 py-3"
                        >
                            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-black text-sm font-semibold flex-shrink-0">
                                {getInitials(getDisplayName(entity))}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-md text-gray-200 truncate">
                                    {getDisplayName(entity)}
                                </p>
                                {getSubtitle(entity) && (
                                    <p className="text-xs text-gray-400 truncate">
                                        {getSubtitle(entity)}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};