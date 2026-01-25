"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { X, Pencil, Save, Trash } from "lucide-react";

import { getAllTeachers } from "@/api/teachers/get-all-teachers";
import { getAllBatches } from "@/api/batches/get-all-batches";

import { getAllVendors } from "@/api/vendors/get-all-vendors";
import { deleteEntity, updateEntity } from "@/api/institutions/entity";
import { getTeacherByInstitute } from "@/api/teachers/get-teachers-by-institute";
type EntityListProps = {
  type: string;
  institutionId?: string;
};

export const EntityList = ({ type, institutionId }: EntityListProps) => {
  const router = useRouter();

  const [entities, setEntities] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});

  /* ----------------------------- Helpers ----------------------------- */

  const isEditableEntity = type === "Teachers";

  const backendEntityType =
    type === "Teachers" ? "teacher" : null;

  const formatDate = (date?: string) =>
    date ? new Date(date).toLocaleDateString() : "—";

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "string" && value.includes("T")) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) return d.toLocaleString();
    }
    return String(value);
  };

  /* ----------------------------- Fetch ----------------------------- */

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        switch (type) {
          case "Teachers":
            await getTeacherByInstitute((data: any) => {
              setEntities(Array.isArray(data) ? data : []);
            }, institutionId as string);
            break;
          case "Batches":
            await getAllBatches((data: any) => {
              setEntities(Array.isArray(data) ? data : []);
            }, institutionId as string);
            break;
          default:
            setEntities([]);
        }
      } catch (err) {
        console.error(err);
        setEntities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, institutionId]);

  /* ----------------------------- Filtering ----------------------------- */

  const filteredEntities = useMemo(() => {
    if (!searchQuery) return entities;

    return entities.filter((entity) => {
      const q = searchQuery.toLowerCase();

      if (type === "Teachers")
        return (
          entity.name?.toLowerCase().includes(q) ||
          entity.email?.toLowerCase().includes(q)
        );

      if (type === "Batches")
        return (
          entity.batchname?.toLowerCase().includes(q) ||
          entity.branch?.toLowerCase().includes(q)
        );

      return true;
    });
  }, [entities, searchQuery, type]);

  /* ----------------------------- Actions ----------------------------- */

  const handleSeeDetails = (entity: any) => {
    if (type === "Batches") {
      router.push(`/admin-dashboard/batches/${entity.id || entity._id}`);
      return;
    }

    setSelectedEntity(entity);
    setEditData(entity);
    setIsEditing(false);
  };

  const handleEditChange = (key: string, value: string) => {
    setEditData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleUpdate = async () => {
    if (!backendEntityType) return;

    await updateEntity(
      selectedEntity.id || selectedEntity._id,
      { entity: backendEntityType, data: editData },
      null,
    );

    setEntities((prev) =>
      prev.map((e) =>
        (e.id || e._id) === (editData.id || editData._id) ? editData : e,
      ),
    );

    setSelectedEntity(editData);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!backendEntityType || !selectedEntity) return;

    const ok = confirm("Are you sure you want to delete?");
    if (!ok) return;

    await deleteEntity(
      selectedEntity.id || selectedEntity._id,
      { entity: backendEntityType, data: "" },
      null,
    );

    setEntities((prev) =>
      prev.filter(
        (e) => (e.id || e._id) !== (selectedEntity.id || selectedEntity._id),
      ),
    );

    setSelectedEntity(null);
  };

  /* ----------------------------- Render ----------------------------- */

  return (
    <>
      <div className="rounded-xl p-4 mr-4">
        <input
          placeholder={`Search ${type.toLowerCase()}`}
          className="w-full mb-4 bg-[#141414] border border-gray-700 rounded-md px-3 py-2 text-sm text-white outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {loading ? (
          <div className="py-12 text-center text-white/50">Loading...</div>
        ) : filteredEntities.length === 0 ? (
          <div className="py-12 text-center text-white/50">
            No {type.toLowerCase()} found
          </div>
        ) : (
          <div className="border border-white/10 bg-divBg">
            <table className="w-full">
              <thead className="bg-black/30 text-xs text-white/40">
                <tr>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Created</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredEntities.map((entity) => (
                  <tr key={entity.id || entity._id}>
                    <td className="px-6 py-4 text-white font-medium">
                      {entity.name || entity.batchname}
                    </td>
                    <td className="px-6 py-4 text-white/60">
                      {formatDate(entity.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleSeeDetails(entity)}
                        className="border border-primaryBlue/40 px-3 py-1.5 text-xs text-primaryBlue hover:bg-primaryBlue/20"
                      >
                        See details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===================== MODAL ===================== */}
      {selectedEntity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="relative w-full max-w-xl bg-divBg p-6 rounded-xl">
            <button
              onClick={() => setSelectedEntity(null)}
              className="absolute right-4 top-4 text-white/50 hover:text-white"
            >
              <X />
            </button>

            <h2 className="text-xl font-semibold mb-6 text-white">
              {type} Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
              {Object.entries(isEditing ? editData : selectedEntity)
                .filter(([key]) => !["_id", "id", "createdAt"].includes(key))
                .map(([key, value]) => (
                  <div key={key}>
                    <p className="text-xs uppercase text-primaryBlue mb-1">
                      {key}
                    </p>
                    {isEditing ? (
                      <input
                        value={String(value ?? "")}
                        onChange={(e) => handleEditChange(key, e.target.value)}
                        className="w-full bg-black/40 border border-white/10 px-3 py-2 text-sm text-white rounded"
                      />
                    ) : (
                      <p className="text-sm text-white">{formatValue(value)}</p>
                    )}
                  </div>
                ))}
            </div>

            {isEditableEntity && (
              <div className="mt-6 flex justify-end gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded text-sm"
                    >
                      <Save size={16} /> Save
                    </button>
                    <button
                      onClick={() => {
                        setEditData(selectedEntity);
                        setIsEditing(false);
                      }}
                      className="flex items-center gap-2 text-white border border-white px-4 py-2 rounded text-sm"
                    >
                      <X size={16} /> Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 bg-primaryBlue text-white px-4 py-2 rounded text-sm"
                    >
                      <Pencil size={16} /> Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-2 text-white border border-white px-4 py-2 rounded text-sm"
                    >
                      <Trash size={16} /> Delete
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
