import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/component/ui/tabs";
import AllTestCases from "./AllTestCases";
import Solution from "./Solution";
import Submissions from "./Submissions";
import Templates from "./Templates";
import { useColors } from "@/component/general/(Color Manager)/useColors";

function ProblemInfo({ content }: any) {
  const Colors = useColors();
  return (
    <div className={`w-full ${Colors.background.primary}`}>
      <Tabs defaultValue="solution" className="flex flex-col h-full">
        <TabsList
          className={` w-full ${Colors.border.defaultThin} ${Colors.background.secondary} px-4`}
        >
          <TabsTrigger className="cursor-pointer" value="solution">
            Solution
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="general">
            Problem
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="testcases">
            Testcases
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="templates">
            Templates
          </TabsTrigger>
        </TabsList>

        <div
          className="flex-1 overflow-y-auto px-6 py-4"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            //@ts-ignore
            WebkitScrollbar: { display: "none" },
          }}
        >
          <TabsContent value="testcases">
            <AllTestCases />
          </TabsContent>
          <TabsContent value="solution">
            <Solution />
          </TabsContent>
          <TabsContent value="general">
            <Submissions content={content} />
          </TabsContent>
          <TabsContent value="templates">
            <Templates />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

export default ProblemInfo;
