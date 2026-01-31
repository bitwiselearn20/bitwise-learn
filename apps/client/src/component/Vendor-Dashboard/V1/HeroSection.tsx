"use client";

import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { useColors } from "@/component/general/(Color Manager)/useColors";
import useVendor from "@/store/vendorStore";
import { getVendorDashboard } from "@/api/vendors/get-vendor-dashboard";
import { getAllInstitutions } from "@/api/institutions/get-all-institutions";
import DashboardInfo from "@/component/AllInstitutions/v1/DashboardInfo";
import Filter from "@/component/general/Filter";

function Header({ name, email, tagline }: any) {
  const Colors = useColors();

  return (
    <div className="flex justify-between p-4">
      <div>
        <span className={`text-5xl ${Colors.text.special}`}>Greetings,</span>{" "}
        <span className={`text-5xl ${Colors.text.primary}`}>{name}</span>
        <div className="mt-2 text-lg">
          <span className={Colors.text.primary}>
            {tagline || "Welcome back to your dashboard"}
          </span>
        </div>
      </div>

      <div className="flex mr-11 items-center gap-6">
        <div className="p-6 bg-white rounded-full">
          <User size={32} />
        </div>

        <div>
          <h1 className={`${Colors.text.primary} text-2xl font-semibold`}>
            {name}
          </h1>
          <p className={Colors.text.secondary}>{email}</p>
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const Colors = useColors();
  const vendor = useVendor();
  const setVendor = useVendor((s) => s.setData);

  console.log(vendor)

  if(!vendor) return null;

  const [institutionData, setInstitutionData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // ✅ Fetch vendor ONCE
  useEffect(() => {
    if (!vendor) {
      getVendorDashboard(setVendor);
    }
  }, []);

  useEffect(() => {
    getAllInstitutions(setInstitutionData);
  }, []);

  if (!vendor) {
    return <div className="p-10">Loading dashboard...</div>;
  }

  return (
    <>
      <Header
        name={vendor.info?.name}
        email={vendor.info?.email}
        tagline={vendor.info?.tagline}
      />

      <div className="p-10 w-full">
        <h2 className={`text-2xl font-semibold mb-4 ${Colors.text.special}`}>
          Institutions
        </h2>

        <div className="flex flex-col gap-10">
          <Filter data={institutionData} setFilteredData={setFilteredData} />
          <DashboardInfo data={filteredData} />
        </div>
      </div>
    </>
  );
}
