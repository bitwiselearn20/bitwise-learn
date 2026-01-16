import SideBar from "@/component/general/SideBar"
import CourseForm from "@/component/(admin-course-pages)/course-form/CourseForm"
import CourseBuilder from "@/component/(admin-course-pages)/course-builder/CourseBuilder";
import { useState } from "react";


type courseStep = "form" | "builder";

export default function AdminCourse() {

    const [step, setStep] = useState<courseStep>("form");

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <SideBar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto px-10 py-10">

                {/* {step === "form" && (
                    <CourseForm onContinue={() => setStep("builder")} />
                )} */}

                {step === "builder" && <CourseBuilder />}
            </main>
        </div>
    )
}