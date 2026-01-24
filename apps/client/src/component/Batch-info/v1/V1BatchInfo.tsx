import { useState } from "react";
import BatchSidebar from "./BatchSidebar";
import { Tabs } from "./Tabs";
import { EntityList } from "./EntityList";
import { json } from "stream/consumers";

type BatchInfoProps = {
  batch: any;
};

const BatchInfo = ({ batch }: BatchInfoProps) => {
  const [activeTab, setActiveTab] = useState("Teachers");
  console.log("batches is" + JSON.stringify(batch));
  return (
    <div className="min-h-screen bg-[#0f0f0f] p-6">
      <div className="flex gap-6 max-w-screen mx-auto">
        <BatchSidebar batch={batch} />

        <main className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} />
          <EntityList type={activeTab} batchId={batch.id} />
        </main>
      </div>
    </div>
  );
};

export default BatchInfo;
