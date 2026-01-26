"use client";
import { getAllAdmins } from "@/api/admins/get-all-admins";
import Filter from "@/component/general/Filter";
import SideBar from "@/component/general/SideBar";
import React, { useEffect, useState } from "react";
import DashboardInfo from "./DashboardInfo";
import { Plus } from "lucide-react";
import AdminForm from "./AdminForm";
import { createAdmin } from "@/api/admins/create-admin";
import toast from "react-hot-toast";

function V1AllAdmins() {
  const [data, setData] = useState([]);
  const [addNew, setAddNew] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  useEffect(() => {
    getAllAdmins(setData);
  }, []);
  const handleCreateAdmin = async (data: any) => {
    try {
      await createAdmin(data);
      setAddNew(false);
      toast.success("Admin Created Successfully");
      getAllAdmins(setData);
    } catch (err) {
      toast.error("Error creating Admin");
      console.error(err);
    }
  };
  return (
    <div className="flex">
      {addNew && <AdminForm openForm={setAddNew} onSubmit={handleCreateAdmin} />}
      <div className="h-screen">
        <SideBar />
      </div>

      <div className="ml-10 mt-10 w-full">
        <div className="w-[80%] mx-auto mb-5 flex justify-between">
          <h1 className="text-3xl ml-3 text-white/60">Manage Admins</h1>
          <button
            onClick={() => setAddNew(true)}
            className="text-primaryBlue flex gap-2 border-primaryBlue border p-2 rounded-xl"
          >
            <Plus className="text-primaryBlue" />
            Add Admins
          </button>
        </div>
        <Filter data={data} setFilteredData={setFilteredData} />
        <DashboardInfo data={filteredData} />
      </div>
    </div>
  );
}

export default V1AllAdmins;
