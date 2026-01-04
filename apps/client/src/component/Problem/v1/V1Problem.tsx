"use client";
import React, { useRef, useState, useEffect } from "react";
import CodeEditor from "./Editor";
import TestCases from "./TestCases";
import Description from "./Description";
import Solution from "./Solution";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/component/ui/tabs";
import Submission from "./Submission";
import { EntityList } from "@/component/Institution-info/v1/EntityList";

function V1Problem({ data }: any) {
  /* Sidebar */
  const [sidebarWidth, setSidebarWidth] = useState(720);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isSidebarResizing = useRef(false);

  /* Editor split (flex ratio instead of %) */
  const [editorRatio, setEditorRatio] = useState(60); // out of 100
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const isEditorResizing = useRef(false);

  /* Sidebar resize */
  const handleSidebarMouseDown = () => {
    isSidebarResizing.current = true;
    document.body.style.cursor = "col-resize";
  };

  /* Editor resize */
  const handleEditorMouseDown = () => {
    isEditorResizing.current = true;
    document.body.style.cursor = "row-resize";
  };

  const handleMouseMove = (e: MouseEvent) => {
    /* Sidebar */
    if (isSidebarResizing.current && sidebarRef.current) {
      const left = sidebarRef.current.getBoundingClientRect().left;
      const width = e.clientX - left;
      if (width >= 320 && width <= 720) {
        setSidebarWidth(width);
      }
    }

    /* Editor split */
    if (isEditorResizing.current && rightPanelRef.current) {
      const rect = rightPanelRef.current.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const ratio = (y / rect.height) * 100;

      if (ratio >= 30 && ratio <= 75) {
        setEditorRatio(ratio);
      }
    }
  };

  const handleMouseUp = () => {
    isSidebarResizing.current = false;
    isEditorResizing.current = false;
    document.body.style.cursor = "default";
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className="h-screen flex bg-neutral-900 text-white overflow-hidden">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className="border-r border-neutral-700 flex flex-col relative"
        style={{ width: sidebarWidth }}
      >
        <Tabs defaultValue="description" className="flex flex-col h-full">
          <TabsList className="border-b w-full border-neutral-700 bg-neutral-900 px-4">
            <TabsTrigger value="description" className="">
              Description
            </TabsTrigger>
            <TabsTrigger value="solution">Solution</TabsTrigger>
            <TabsTrigger value="submission">Submission</TabsTrigger>
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
            <TabsContent value="description">
              <Description content={data} />
            </TabsContent>
            <TabsContent value="solution">
              <Solution content={data.solution} />
            </TabsContent>
            <TabsContent value="submission">
              <Submission content={data.submission} />
            </TabsContent>
          </div>
        </Tabs>

        {/* Sidebar Resize */}
        <div
          onMouseDown={handleSidebarMouseDown}
          className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-neutral-700 hover:bg-neutral-500"
        />
      </div>

      {/* Right Panel */}
      <div ref={rightPanelRef} className="flex-1 flex flex-col min-w-0">
        {/* Code Editor */}
        <div style={{ flex: `${editorRatio} 0 0` }} className="min-h-0">
          <CodeEditor template={data.problemTemplates} />
        </div>

        {/* Resize Handle */}
        <div
          onMouseDown={handleEditorMouseDown}
          className="h-1 cursor-row-resize bg-neutral-700 hover:bg-neutral-500"
        />

        {/* Test Cases */}
        <div
          style={{
            flex: `${100 - editorRatio} 0 0`,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            //@ts-ignore
            WebkitScrollbar: { display: "none" },
          }}
          className="overflow-y-auto min-h-0"
        >
          <TestCases testCases={data.testCases} />
        </div>
      </div>
    </div>

  );
}

export default V1Problem;
