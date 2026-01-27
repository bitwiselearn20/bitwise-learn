import SideBar from "@/component/general/SideBar";
import React from "react";
import DashboardHero from "./DashboardHero";
import AllDsaProblem from "./AllDsaProblem";
import { useColors } from "@/component/general/(Color Manager)/useColors";

function V1ProblemAdminDashboard() {
  const Colors = useColors();
  return (
    <div className={`relative flex gap-4 h-screen ${Colors.background.primary}`}>
      <SideBar />
      <div className="w-full">
        <DashboardHero />
        <AllDsaProblem />
      </div>
    </div>
  );
}

export default V1ProblemAdminDashboard;
