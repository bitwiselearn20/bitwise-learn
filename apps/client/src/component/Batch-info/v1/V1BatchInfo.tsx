import { useState } from "react";
import BatchSidebar from "./BatchSidebar";
import { Tabs } from "./Tabs";
import { EntityList } from "./EntityList";
import { json } from "stream/consumers";

type BatchInfoProps = {
  batch: any;
  institutionId: string;
};

const BatchInfo = ({ batch, institutionId }: BatchInfoProps) => {
  const [activeTab, setActiveTab] = useState("Teachers");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  console.log("batches is" + JSON.stringify(batch));
  return (
    <div className="min-h-screen bg-[#0f0f0f] p-6">
      <div className="flex gap-6 max-w-screen mx-auto">
        <BatchSidebar batch={batch} />

        <main className="flex-1">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            batchId={batch.id}
            batchName={batch.batchname}
            institutionId={institutionId}
            onStudentCreated={handleRefresh}
          />
          <EntityList key={refreshKey} type={activeTab} batchId={batch.id} />
        </main>
      </div>
    </div>
  );
};

export default BatchInfo;
