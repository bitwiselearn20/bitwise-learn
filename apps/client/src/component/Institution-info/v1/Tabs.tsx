import BatchesForm from "@/component/general/BatchesForm";
import TeacherForm from "@/component/general/TeacherForm";
import { Plus, X } from "lucide-react";
import { useState } from "react";

type TabsProps = {
  value: string;
  onValueChange: (value: string) => void;
  institutionId: string;
  onBatchCreated?: () => void;
};

type RenderComponentProps = {
  value: string;
  institutionId: string;
  onClose: (value?: boolean) => void;
  onBatchCreated?: () => void;
};

const RenderComponent = ({
  value,
  institutionId,
  onClose,
  onBatchCreated,
}: RenderComponentProps) => {
  switch (value) {
    case "Teachers":
      return <TeacherForm openForm={onClose} institutionId={institutionId} />;
    case "Batches":
      return (
        <BatchesForm
          openForm={onClose}
          institutionId={institutionId}
          onSubmit={() => {
            onBatchCreated?.();
          }}
        />
      );
    default:
      return null;
  }
};

export const Tabs = ({ value, onValueChange, institutionId, onBatchCreated }: TabsProps) => {
  const [addNew, setAddNew] = useState(false);
  const tabs = ["Teachers", "Batches"];

  return (
    <>
      {addNew && (
        <div className="fixed inset-0 z-50 bg-black/80 text-white flex justify-center items-center">
          <div className="relative bg-neutral-900 p-8 rounded-lg w-full max-w-xl">
            <button
              onClick={() => setAddNew(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X />
            </button>

            <RenderComponent
              value={value}
              institutionId={institutionId}
              onClose={() => setAddNew(false)}
              onBatchCreated={onBatchCreated}
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-6">
        <div className="flex gap-4 px-5 my-5">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onValueChange(tab)}
              className={`px-4 py-1.5 rounded-md text-md transition ${value === tab
                  ? "bg-blue-500 text-white"
                  : "text-gray-400 hover:text-white"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <button
          onClick={() => setAddNew(true)}
          className="flex items-center gap-2 border border-primaryBlue px-3 py-2 rounded text-white hover:bg-primaryBlue/10"
        >
          <Plus size={18} />
          Add New {value}
        </button>
      </div>
    </>
  );
};
