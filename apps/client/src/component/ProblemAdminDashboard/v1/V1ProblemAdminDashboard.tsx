import SideBar from "@/component/general/SideBar";
import React from "react";
import DashboardHero from "./DashboardHero";
import AllDsaProblem from "./AllDsaProblem";

function V1ProblemAdminDashboard() {
  return (
    <div className="relative flex gap-4">
      <SideBar />
      <div className="w-full">
        <DashboardHero />
        <AllDsaProblem />
      </div>
    </div>
  );
}

export default V1ProblemAdminDashboard;
