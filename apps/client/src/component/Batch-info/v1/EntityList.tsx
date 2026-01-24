"use client";

import { useEffect, useState, useMemo } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import { getStudentsByBatch } from "@/api/students/get-students-by-batch";
import { getTeachersByBatch } from "@/api/teachers/get-teachers-by-batch";
import { deleteEntity, updateEntity } from "@/api/institutions/entity";
// import { getAllAssessments } from "@/api/vendors/get-all-vendors";

type EntityListProps = {
  type: string;
  batchId?: string;
};

export const EntityList = ({ type, batchId }: EntityListProps) => {
  const [entities, setEntities] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEntity, setEditedEntity] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEdit = () => {
    setEditedEntity({ ...selectedEntity }); // clone data
    setIsEditing(true);
  };

  const handleFieldChange = (key: string, value: any) => {
    setEditedEntity((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // TODO: UPDATE STUDENT API CALL GOES HERE
      await updateEntity(
        editedEntity.id || editedEntity._id,
        { data: editedEntity, entity: type },
        null,
      );

      setIsEditing(false);
      setSelectedEntity(editedEntity); // update UI after success
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const handleDelete = async () => {
    try {
      // TODO:  DELETE STUDENT API CALL GOES HERE
      // await deleteStudentApi(selectedEntity.id || selectedEntity._id)
      await deleteEntity(
        editedEntity.id || editedEntity._id,
        { data: "", entity: type },
        null,
      );
      setShowDeleteConfirm(false);
      setSelectedEntity(null);
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        switch (type) {
          case "Students":
            await getStudentsByBatch((data: any) => {
              setEntities(Array.isArray(data) ? data : []);
            }, batchId as string);
            break;
          case "Teachers":
            await getTeachersByBatch((data: any) => {
              setEntities(Array.isArray(data) ? data : []);
            }, batchId as string);
            break;
          case "Assessments":
            setEntities([]);
            break;
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
        case "Students":
          return (
            entity.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entity.email?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        case "Teachers":
          return (
            entity.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entity.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entity.phoneNumber
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())
          );
        case "Assessments":
          return (
            entity.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entity.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entity.tagline?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        case "Courses":
          return (
            entity.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entity.description
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())
          );
        default:
          return true;
      }
    });
  }, [entities, searchQuery, type]);

  // const getInitials = (name: string) => {
  //     if (!name) return "??";
  //     const parts = name.trim().split(" ");
  //     if (parts.length >= 2) {
  //         return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  //     }
  //     return name.substring(0, 2).toUpperCase();
  // };

  const getDisplayName = (entity: any) => {
    switch (type) {
      case "Students":
        return entity.name || "Unknown";
      case "Teachers":
        return entity.name || "Unknown Batch";
      case "Assessments":
        return entity.name || "Unknown Vendor";
      case "Courses":
        return entity.name || "Unknown Course";
      default:
        return "Unknown";
    }
  };

  // const getSubtitle = (entity: any) => {
  //     switch (type) {
  //         case "Students":
  //             return entity.email;
  //         case "Teachers":
  //             return `${entity.branch || ""} • ${entity.batchEndYear || ""}`.trim();
  //         case "Assessments":
  //             return entity.tagline || entity.email;
  //         case "Courses":
  //             return entity.instructorName || entity.description;
  //         default:
  //             return "";
  //     }
  // };

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
      case "Students":
        return ["Roll No.", "Name", "Email", "Created"];
      case "Teachers":
        return ["Name", "Email", "Phone", "Created"];
      case "Assessments":
        return ["Name", "Email", "Phone", "Created"];
      case "Courses":
        return ["Name", "Instructor", "Level", "Created"];
      default:
        return ["Name", "Created"];
    }
  };

  const getTableCells = (entity: any) => {
    switch (type) {
      case "Students":
        return [
          entity.rollNumber || "Unknown",
          entity.name || "—",
          entity.email || "—",
          formatDate(entity.createdAt),
        ];
      case "Teachers":
        return [
          entity.name || "Unknown Teacher",
          entity.email || "—",
          entity.phoneNumber || "—",
          formatDate(entity.createdAt),
        ];
      case "Assessments":
        return [
          entity.name || "Unknown Vendor",
          entity.email || "—",
          entity.phoneNumber || "—",
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
        return [getDisplayName(entity), formatDate(entity.createdAt)];
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
        <>
          {/* Details Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-divBg p-6 shadow-2xl">
              {/* Top Right Action Buttons */}
              <div className="absolute right-4 top-4 flex items-center gap-3">
                {!isEditing && (
                  <button
                    onClick={() => {
                      setEditedEntity({ ...selectedEntity });
                      setIsEditing(true);
                    }}
                    className="text-white/50 transition hover:text-primaryBlue"
                  >
                    <Pencil size={18} />
                  </button>
                )}

                {!isEditing && (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-white/50 transition hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                )}

                {isEditing && (
                  <>
                    <button
                      onClick={async () => {
                        try {
                          // TODO: UPDATE STUDENT API CALL GOES HERE
                          // await updateStudentApi(
                          //     editedEntity.id || editedEntity._id,
                          //     editedEntity
                          // )

                          setSelectedEntity(editedEntity);
                          setIsEditing(false);
                          setEditedEntity(null);
                        } catch (err) {
                          console.error("Update failed", err);
                        }
                      }}
                      className="rounded-md bg-primaryBlue px-3 py-1 text-sm text-white"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditedEntity(null);
                      }}
                      className="rounded-md bg-white/10 px-3 py-1 text-sm text-white"
                    >
                      Cancel
                    </button>
                  </>
                )}

                <button
                  onClick={() => {
                    setSelectedEntity(null);
                    setIsEditing(false);
                    setEditedEntity(null);
                  }}
                  className="text-white/50 transition hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

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
                {Object.entries(isEditing ? editedEntity : selectedEntity)
                  .filter(([key]) => key !== "id" && key !== "_id")
                  .map(([key, value]) => (
                    <div key={key}>
                      <p className="my-3 text-[11px] uppercase tracking-wide text-primaryBlue">
                        {key.replace(/_/g, " ")}
                      </p>

                      {isEditing ? (
                        <input
                          value={editedEntity[key] ?? ""}
                          onChange={(e) =>
                            setEditedEntity((prev: any) => ({
                              ...prev,
                              [key]: e.target.value,
                            }))
                          }
                          className="w-full rounded-md bg-black/40 px-2 py-1 text-sm text-white outline-none focus:ring-1 focus:ring-primaryBlue"
                        />
                      ) : (
                        <p className="break-words text-sm text-white">
                          {formatValue(value)}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70">
              <div className="w-full max-w-sm rounded-xl bg-divBg p-6 text-center">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Confirm Delete
                </h3>
                <p className="mb-6 text-sm text-white/60">
                  This action cannot be undone.
                </p>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="rounded-md bg-white/10 px-4 py-2 text-white"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={async () => {
                      try {
                        // TODO: DELETE STUDENT API CALL GOES HERE
                        // await deleteStudentApi(
                        //     selectedEntity.id || selectedEntity._id
                        // )

                        setShowDeleteConfirm(false);
                        setSelectedEntity(null);
                      } catch (err) {
                        console.error("Delete failed", err);
                      }
                    }}
                    className="rounded-md bg-red-500 px-4 py-2 text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};
