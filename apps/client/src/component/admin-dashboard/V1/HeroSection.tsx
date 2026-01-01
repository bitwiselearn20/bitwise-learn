"use client";

import {
    Plus,
    Check,
    Trash,
    PenLine,
    User,
    KeyRound,
    School,
    Handshake,
    BookOpen,
    Search,
    SlidersHorizontal,
    MoreHorizontal,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getAllAdmins } from "@/api/admins/get-all-admins";
import { getAllInstitutions } from "@/api/institutions/get-all-institutions";
import { getAllVendors } from "@/api/vendors/get-all-vendors";
type FieldType = "Admins" | "Vendors" | "Institutions" | "Batches";

type Item = {
    id: number;
    name: string;
};

export default function HeroSection() {
    /* ---------------- API (UNCHANGED) ---------------- */


    /* ---------------- ENTITY STATES ---------------- */
    const [admins, setAdmins] = useState([]);
    useEffect(() => {
        getAllAdmins(setAdmins);
        console.log(admins);

    }, []);
    const [institutions, setInstitutions] = useState([]);
    useEffect(() => {
        getAllInstitutions(setInstitutions);
        console.log(institutions);

    }, []);
    const [vendors, setVendors] = useState([]);
    useEffect(() => {
        getAllVendors(setVendors);
        console.log(vendors);

    }, []);

    // const [partners, setPartners] = useState<Item[]>([
    //     { id: 1, name: "Partner A" },
    //     { id: 2, name: "Partner B" },
    // ]);

    // const [institutions, setInstitutions] = useState<Item[]>([
    //     { id: 1, name: "Institution X" },
    //     { id: 2, name: "Institution Y" },
    // ]);

    const [batches, setBatches] = useState<Item[]>([
        { id: 1, name: "Batch 2024" },
        { id: 2, name: "Batch 2025" },
    ]);

    /* ---------------- UI STATES ---------------- */
    const [field, setField] = useState<FieldType>("Admins");
    const [searchTerm, setSearchTerm] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingValue, setEditingValue] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [newValue, setNewValue] = useState("");

    const admin_name = "Britto Anand";
    const admin_email = "brittoanand@example.com";

    /* ---------------- HELPERS ---------------- */
    const getCurrentData = (): Item[] => {
        switch (field) {
            case "Admins":
                return admins;
            case "Vendors":
                return vendors;
            case "Institutions":
                return institutions;
            case "Batches":
                return batches;
        }
    };

    const setCurrentData = (updater: (prev: Item[]) => Item[]) => {
        switch (field) {
            case "Admins":
                setAdmins(updater);
                break;
            case "Vendors":
                setVendors(updater);
                break;
            case "Institutions":
                setInstitutions(updater);
                break;
            case "Batches":
                setBatches(updater);
                break;
        }
    };

    const currentData = getCurrentData();

    const filteredData = currentData.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    /* ---------------- CRUD HANDLERS ---------------- */
    function handleEditSave(id: number) {
        setCurrentData((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, name: editingValue } : item
            )
        );
        setEditingId(null);
        setEditingValue("");
    }

    function handleDelete(id: number) {
        setCurrentData((prev) => prev.filter((item) => item.id !== id));
    }

    function handleAdd() {
        if (!newValue.trim()) return;

        setCurrentData((prev) => [
            ...prev,
            { id: Date.now(), name: newValue },
        ]);

        setNewValue("");
        setIsAdding(false);
    }

    /* ---------------- ICONS ---------------- */
    const fieldIcons = {
        Admins: KeyRound,
        Vendors: Handshake,
        Institutions: School,
        Batches: BookOpen,
    };

    const ActiveIcon = fieldIcons[field];

    /* ---------------- JSX ---------------- */
    return (
        <>
            {/* Top Section */}
            <div className="flex justify-between p-4">
                <div>
                    <span className="text-primaryBlue text-5xl">Greetings,</span>{" "}
                    <span className="text-white text-5xl">Admin</span>
                    <div className="mt-2 text-lg">
                        <span className="text-white">Enjoy managing</span>{" "}
                        <span className="text-primaryBlue">B</span>
                        <span className="text-white">itwise Learn</span>
                    </div>
                </div>

                <div className="flex mr-11">
                    <div className="p-8 bg-white rounded-full flex justify-center items-center">
                        <User size={35} color="black" />
                    </div>
                    <div className="text-white flex flex-col mt-3 ml-4">
                        <h1 className="text-3xl">{admin_name}</h1>
                        <p>{admin_email}</p>
                    </div>
                </div>
            </div>

            {/* Selector */}
            <div className="bg-divBg mr-40 ml-20 mt-4 flex rounded-2xl">
                {(["Admins", "Vendors", "Institutions", "Batches"] as FieldType[]).map(
                    (type, i) => {
                        const Icon = fieldIcons[type];
                        return (
                            <div
                                key={type}
                                className="relative flex flex-1 items-center justify-center py-4"
                            >
                                <button
                                    onClick={() => {
                                        setField(type);
                                        setSearchTerm("");
                                    }}
                                    className="flex flex-col items-center hover:scale-105 transition"
                                >
                                    <Icon size={30} color="white" />
                                    <h1 className="text-white text-lg">{type}</h1>
                                </button>
                                {i !== 3 && (
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 h-12 w-[2px] bg-white" />
                                )}
                            </div>
                        );
                    }
                )}
            </div>

            {/* Search & Actions */}
            <div className="flex items-center justify-between mt-6 ml-20 mr-40">
                <div className="flex items-center bg-divBg rounded-xl px-4 py-3 w-[55%]">
                    <Search size={20} className="text-primaryBlue mr-3" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent outline-none text-white w-full"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 bg-primaryBlue px-5 py-3 rounded-xl text-black">
                        <SlidersHorizontal size={20} />
                        Filter
                    </button>
                    <button className="flex items-center gap-2 bg-primaryBlue px-5 py-3 rounded-xl text-black">
                        <MoreHorizontal size={20} />
                        Options
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="bg-divBg ml-5 mr-15 mt-6 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <ActiveIcon size={20} className="text-white" />
                        <h1 className="text-white text-lg font-semibold">{field}</h1>
                    </div>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="text-primaryBlue"
                    >
                        <Plus />
                    </button>
                </div>

                <div className="max-h-[320px] overflow-y-auto space-y-3 pr-2">
                    {isAdding && (
                        <div className="flex items-center gap-3 bg-black/30 px-4 py-3 rounded-xl">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                                <User size={16} color="black" />
                            </div>
                            <input
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                                className="bg-transparent border-b border-primaryBlue outline-none text-white flex-1"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleAdd();
                                    if (e.key === "Escape") setIsAdding(false);
                                }}
                            />
                            <button onClick={handleAdd} className="text-primaryBlue">
                                <Check />
                            </button>
                        </div>
                    )}

                    {filteredData.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between bg-black/30 px-4 py-3 rounded-xl"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                                    <User size={16} color="black" />
                                </div>
                                {editingId === item.id ? (
                                    <input
                                        value={editingValue}
                                        onChange={(e) => setEditingValue(e.target.value)}
                                        className="bg-transparent border-b border-primaryBlue outline-none text-white"
                                        autoFocus
                                        onBlur={() => handleEditSave(item.id)}
                                    />
                                ) : (
                                    <span className="text-white">{item.name}</span>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        setEditingId(item.id);
                                        setEditingValue(item.name);
                                    }}
                                    className="text-primaryBlue"
                                >
                                    <PenLine />
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="text-red-500"
                                >
                                    <Trash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
