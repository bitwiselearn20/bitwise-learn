"use client";

import SideBar from "@/component/general/SideBar";
import HeroSection from "./HeroSection";
import { useColors } from "@/component/general/(Color Manager)/useColors";

export default function AdminDashboardV1() {
  const Colors = useColors();
  return (
    <div className={`flex h-screen overflow-hidden ${Colors.background.primary}`}>
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-10 py-10">
        <HeroSection />
      </main>
    </div>
  );
}
