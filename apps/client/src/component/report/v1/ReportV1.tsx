import SideBar from "@/component/general/SideBar";
import React from "react";
import ReportHero from "./ReportHero";
import { useColors } from "@/component/general/(Color Manager)/useColors";

function ReportV1() {
  const Colors = useColors();

  return (
    <div className={`relative flex gap-1 h-screen ${Colors.background.primary}`}>
      <SideBar />
      <div className="w-full">
        <ReportHero />
      </div>
    </div>
  );
}

export default ReportV1;
