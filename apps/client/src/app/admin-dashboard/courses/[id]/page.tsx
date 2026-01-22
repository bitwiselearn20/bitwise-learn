"use client";

import React from "react";
import CourseBuilderV1 from "@/component/(admin-course-pages)/course-builder/v1/CourseBuilderV1";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function AdminCourse({ params }: PageProps) {
  const { id } = React.use(params);

  return (
    <div className="flex h-screen overflow-hidden ">
      <main className="flex-1 overflow-y-auto px-10 py-10">
        <CourseBuilderV1 courseId={id} />
      </main>
    </div>
  );
}
