import BatchesForm from "@/component/general/BatchesForm";
import TeacherForm from "@/component/general/TeacherForm";
import StudentForm from "@/component/general/StudentForm";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllBatches } from "@/api/batches/get-all-batches";

type Batch = {
  id: string;
  batchname: string;
  branch: string;
  batchEndYear: string;
};

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
  batches?: Batch[];
};

const RenderComponent = ({
  value,
  institutionId,
  onClose,
  onBatchCreated,
  batches = [],
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
    case "Students":
      return (
        <StudentForm
          openForm={onClose}
          institutionId={institutionId}
          batches={batches}
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
  const [batches, setBatches] = useState<Batch[]>([]);
  const tabs = ["Teachers", "Batches", "Students"];

  useEffect(() => {
    if (institutionId) {
      getAllBatches((data: Batch[]) => {
        setBatches(Array.isArray(data) ? data : []);
      }, institutionId).catch(() => {
        setBatches([]);
      });
    }
  }, [institutionId]);

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
              batches={batches}
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
