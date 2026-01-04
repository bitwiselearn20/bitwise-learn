"use client";

import { motion } from "framer-motion";
import TestimonialCard from "./TestimonialCard";
import "./helper.css";

const testimonials = [
  {
    name: "Arjun Singh",
    role: "SDE at TCS",
    text: "The Assignments in the Courses were a game changer.",
    color: "bg-blue-600",
  },
  {
    name: "Kavya Reddy",
    role: "Frontend Dev at Swiggy",
    text: "I loved the project-based learning approach. Building real apps gave me the confidence I needed",
    color: "bg-green-600",
  },
  {
    name: "Vikram Kumar",
    role: "Data Engineer at Infosys",
    text: "Instructors explain complex topics simply.",
    color: "bg-purple-600",
  },
  {
    name: "Rohan Mehta",
    role: "Full Stack Dev at Zomato",
    text: "The best investment I made for my career. The community support is amazing.",
    color: "bg-orange-600",
  },
  {
    name: "Ananya Desai",
    role: "Cloud Engineer at Wipro",
    text: "Getting JAVA certified through Bitwise Learn opened so many doors for me.",
    color: "bg-red-500",
  },
];

export default function LinearTestimonials() {
  return (
    <div className="relative w-400 right-40">
      <div className="carousel mt-30">
        <div className="group mb-10 pt-5">
          {testimonials.map((t, i) => (
            <TestimonialCard
              key={`a-${i}`}
              name={t.name}
              role={t.role}
              text={t.text}
              accentColor={t.color}
            />
          ))}
        </div>
        <div aria-hidden className="group mb-10 pt-5">
          {testimonials.map((t, i) => (
            <TestimonialCard
              key={`b-${i}`}
              name={t.name}
              role={t.role}
              text={t.text}
              accentColor={t.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
