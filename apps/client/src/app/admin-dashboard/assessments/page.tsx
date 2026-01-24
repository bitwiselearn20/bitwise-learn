import Assessments from "@/component/Assessments/Assessments";
import SideBar from "@/component/general/SideBar";

const page = () => {
  return (
    <div className="flex h-screen overflow-hidden ">
      <SideBar />
      <main className="flex-1 overflow-y-auto px-10 py-10">
        <Assessments />
      </main>
    </div>
  );
};

export default page;
