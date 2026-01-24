"use client";

import LinearTestimonials from "./RotatingTestimonials";

export default function TestimonialsSection() {
  return (
    <section className="py-4">
      <div className="hidden md:block">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="mb-3 text-6xl font-bold text-white">
            Success <span className="text-blue-600">Stories</span>
          </h2>

          <p className="mb-6 text-gray-500">
            Hear from learners who transformed their careers.
          </p>

          <LinearTestimonials />
        </div>
      </div>
    </section>
  );
}
