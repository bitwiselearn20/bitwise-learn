import SideBar from "@/component/general/SideBar";
import React from "react";
import ReportHero from "./ReportHero";

function ReportV1() {
  return (
    <div className="relative flex gap-4 h-screen">
      <SideBar />
      <div className="w-full">
        <ReportHero />
      </div>
    </div>
  );
}

export default ReportV1;
