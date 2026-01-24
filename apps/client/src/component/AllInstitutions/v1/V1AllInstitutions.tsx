"use client";
import { getAllInstitutions } from "@/api/institutions/get-all-institutions";
import Filter from "@/component/general/Filter";
import SideBar from "@/component/general/SideBar";
import { useEffect, useState } from "react";
import DashboardInfo from "./DashboardInfo";
import { Plus } from "lucide-react";
import InstitutionForm from "./InstitutionForm";
import { createInstitution } from "@/api/institutions/create-institution";
import toast from "react-hot-toast";

function V1AllInstitutions() {
  const [data, setData] = useState<any>([]);
  const [addNew, setAddNew] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  useEffect(() => {
    getAllInstitutions(setData);
  }, []);

  const handleCreateInstitution = async (data: any) => {
    try {
      await createInstitution(data);
      setAddNew(false);
      toast.success("Institute Created Successfully");
      getAllInstitutions(setData);
    } catch (err) {
      toast.error("Error creating Institute");
      console.error(err);
    }
  };

  return (
    <div className="flex">
      {addNew && (
        <InstitutionForm
          openForm={setAddNew}
          onSubmit={handleCreateInstitution}
        />
      )}
      <div className="h-screen">
        <SideBar />
      </div>

      <div className="ml-10 mt-10 w-full">
        <div className="w-[80%] mx-auto mb-5 flex justify-between">
          <h1 className="text-3xl ml-3 text-white/60">Manage Institutions</h1>
          <button
            onClick={() => setAddNew(true)}
            className="text-primaryBlue flex gap-2 border-primaryBlue border p-2 rounded-xl"
          >
            <Plus className="text-primaryBlue" />
            Add Institution
          </button>
        </div>
        <Filter data={data} setFilteredData={setFilteredData} />
        <DashboardInfo data={filteredData} />
      </div>
    </div>
  );
}

export default V1AllInstitutions;
