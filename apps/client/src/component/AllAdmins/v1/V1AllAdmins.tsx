"use client";
import { getAllAdmins } from "@/api/admins/get-all-admins";
import Filter from "@/component/general/Filter";
import SideBar from "@/component/general/SideBar";
import React, { useEffect, useState } from "react";
import DashboardInfo from "./DashboardInfo";
import { Plus } from "lucide-react";
import VendorForm from "./VendorForm";

function V1AllAdmins() {
  const [data, setData] = useState([]);
  const [addNew, setAddNew] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  useEffect(() => {
    getAllAdmins(setData);
  }, []);
  return (
    <div className="flex">
      {addNew && <VendorForm openForm={setAddNew} />}
      <div>
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
