"use client"
import SideBar from "@/component/general/SideBar"
import HeroSection from "./HeroSection"

export default function AdminDashboardV1() {
    return (
        <div className="flex">
            <div>
                <SideBar />
            </div>

            <div className="ml-10 mt-10 w-full">
                <HeroSection />
            </div>
        </div>
    )
}