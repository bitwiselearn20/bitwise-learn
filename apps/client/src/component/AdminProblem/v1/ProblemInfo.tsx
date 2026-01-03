import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/component/ui/tabs";
import AllTestCases from "./AllTestCases";
import Solution from "./Solution";
import Submissions from "./Submissions";
import Templates from "./Templates";

function ProblemInfo({ content }: any) {
  return (
    <div className="text-white w-full">
      <Tabs defaultValue="solution" className="flex flex-col h-full">
        <TabsList className="border-b w-full border-neutral-700 bg-neutral-900 px-4">
          <TabsTrigger value="solution">Solution</TabsTrigger>
          <TabsTrigger value="general">Problem</TabsTrigger>
          <TabsTrigger value="testcases" className="">
            Testcases
          </TabsTrigger>
          <TabsTrigger value="templates" className="">
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
