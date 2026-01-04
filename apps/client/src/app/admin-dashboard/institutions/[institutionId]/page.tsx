"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import InstitutionInfo from "@/component/Institution-info/InstitutionInfo";
import { getInstituteData } from "@/api/institutions/get-institute-by-id";

export default function InstitutionPage() {
  const { institutionId } = useParams<{ institutionId: string }>();

  const [institution, setInstitution] = useState<any>(null);

  useEffect(() => {
    if (!institutionId) return;
    getInstituteData(setInstitution, institutionId);
  }, [institutionId]);

  if (!institution) return <div>Loading...</div>;

  return <InstitutionInfo institution={institution} />;
}
