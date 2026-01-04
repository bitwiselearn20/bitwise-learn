"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import InstitutionInfo from "@/component/Institution-info/InstitutionInfo";
import { getInstituteData } from "@/api/institutions/get-institute-by-id";

export default function AllCourses() {
    const searchParams = useSearchParams();
    const institutionId = searchParams.get("id");
    const [institution, setInstitution] = useState<any>(null);

    useEffect(() => {
        if (!institutionId) return;
        getInstituteData(setInstitution, institutionId);
    }, [institutionId]);

    if (!institutionId) {
        return <div className="p-6 text-gray-400">Institution ID is required. Please provide ?id=institutionId in the URL.</div>;
    }

    if (!institution) {
        return <div className="p-6 text-gray-400">Loading...</div>;
    }

    return <InstitutionInfo institution={institution} />;
}