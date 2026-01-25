"use client";

import { useState } from "react";
import InstitutionSidebar from "./InstitutionSidebar";
import { Tabs } from "./Tabs";
import { EntityList } from "./EntityList";

type InstitutionInfoProps = {
  institution: any;
};

const InstitutionInfo = ({ institution }: InstitutionInfoProps) => {
  const [activeTab, setActiveTab] = useState("Teachers");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-6">
      <div className="flex gap-6 max-w-screen mx-auto">
        <InstitutionSidebar
          institution={institution}
          onUpdate={() => { }}
          onDelete={() => { }}
        />

        <main className="flex-1">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            institutionId={institution.id}
            onBatchCreated={handleRefresh}
          />
          <EntityList
            key={refreshKey}
            type={activeTab}
            institutionId={institution.id}
          />
        </main>
      </div>
    </div>
  );
};

export default InstitutionInfo;
