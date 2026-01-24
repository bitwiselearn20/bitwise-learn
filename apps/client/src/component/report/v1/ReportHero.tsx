import { Tabs, TabsContent, TabsList } from "@/component/ui/tabs";
import { TabsTrigger } from "@radix-ui/react-tabs";
import AllAssessments from "./AllAssessments";
import AllCourses from "./AllCourses";

function ReportHero() {
  return (
    <div className="h-screen w-full flex bg-neutral-900 text-white overflow-hidden">
      <div className="border-r border-neutral-800 w-full flex flex-col relative">
        <Tabs defaultValue="courses" className="flex w-full flex-col h-full">
          <TabsList className="border-b w-full justify-evenly border-neutral-800 bg-neutral-900 px-6 py-3 flex gap-6">
            <TabsTrigger
              value="courses"
              className="relative px-4 py-2 text-sm font-medium text-neutral-400 transition-all
                         data-[state=active]:text-white
                         data-[state=active]:after:absolute
                         data-[state=active]:after:left-0
                         data-[state=active]:after:-bottom-[3px]
                         data-[state=active]:after:h-[2px]
                         data-[state=active]:after:w-full
                         data-[state=active]:after:bg-white
                         hover:text-white"
            >
              Courses
            </TabsTrigger>

            <TabsTrigger
              value="assessments"
              className="relative px-4 py-2 text-sm font-medium text-neutral-400 transition-all
                         data-[state=active]:text-white
                         data-[state=active]:after:absolute
                         data-[state=active]:after:left-0
                         data-[state=active]:after:-bottom-[3px]
                         data-[state=active]:after:h-[2px]
                         data-[state=active]:after:w-full
                         data-[state=active]:after:bg-white
                         hover:text-white"
            >
              Assessments
            </TabsTrigger>
          </TabsList>

          <div
            className="flex-1 overflow-y-auto px-8 py-6"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              // @ts-ignore
              WebkitScrollbar: { display: "none" },
            }}
          >
            <TabsContent value="courses" className="animate-fadeIn">
              <AllCourses />
            </TabsContent>

            <TabsContent value="assessments" className="animate-fadeIn">
              <AllAssessments />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

export default ReportHero;
