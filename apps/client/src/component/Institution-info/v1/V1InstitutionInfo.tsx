import { useState } from "react";
import InstitutionSidebar from "./InstitutionSidebar";
import { Tabs } from "./Tabs";
import { EntityList } from "./EntityList";

type InstitutionInfoProps = {
    institution: any;
};

const InstitutionInfo = ({ institution }: InstitutionInfoProps) => {
    const [activeTab, setActiveTab] = useState("Teachers");

    return (
        <div className="min-h-screen bg-[#0f0f0f] p-6">
            <div className="flex gap-6 max-w-screen mx-auto">
                <InstitutionSidebar institution={institution} />

                <main className="flex-1">
                    <Tabs value={activeTab} onValueChange={setActiveTab} />
                    <EntityList
                        type={activeTab}
                        institutionId={institution.id}
                    />
                </main>
            </div>
        </div>
    );
};

export default InstitutionInfo;
