"use client";

import { getAllCourses } from "@/api/courses/course/get-all-courses";
import { enrollInstitutionCourses } from "@/api/courses/course/enrollments/enroll-institution";
import React, { useEffect, useState } from "react";

interface Course {
  id: string;
  name: string;
  description: string;
  level: string;
  duration: string;
  thumbnail?: string;
}

function CourseForm({ batchId }: { batchId: string }) {
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  const handleToggleCourse = (courseId: string) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId],
    );
  };

  const handleSubmit = async () => {
    if (!selectedCourses.length) {
      alert("Please select at least one course");
      return;
    }

    try {
      setLoading(true);
      // API call goes here
      await enrollInstitutionCourses({
        batchId,
        courses: selectedCourses,
      });

      alert("Institution enrolled successfully 🎉");
      setSelectedCourses([]);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while enrolling courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function handleLoad() {
      const data: Course[] = await getAllCourses(true);
      setAllCourses(data);
    }
    handleLoad();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Select Courses</h2>

      {/* Scrollable flex container */}
      <div
        className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-2"
        style={{}}
      >
        {allCourses.map((course) => (
          <label
            key={course.id}
            className="flex gap-4 items-start border p-3 rounded cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedCourses.includes(course.id)}
              onChange={() => handleToggleCourse(course.id)}
              className="mt-2"
            />

            {/* Thumbnail */}
            {course.thumbnail && (
              <img
                src={course.thumbnail}
                alt={course.name}
                className="w-20 h-14 object-cover rounded"
              />
            )}

            {/* Course info */}
            <div className="flex flex-col">
              <p className="font-medium">{course.name}</p>
              <p className="text-sm text-gray-500">
                {course.level} • {course.duration}
              </p>
              <p className="text-sm text-gray-700 line-clamp-2">
                {course.description}
              </p>
            </div>
          </label>
        ))}
      </div>

      <button
        disabled={loading}
        className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
        onClick={handleSubmit}
      >
        {loading ? "Enrolling..." : "Enroll Institution"}
      </button>
    </div>
  );
}

export default CourseForm;
