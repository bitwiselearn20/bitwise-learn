"use client";

import { motion } from "framer-motion";

type TestimonialCardProps = {
  name: string;
  role: string;
  text: string;
  accentColor?: string;
};

export default function TestimonialCard({
  name,
  role,
  text,
  accentColor = "from-blue-500 to-blue-400",
}: TestimonialCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="
        relative w-[320px] min-w-[320px] h-50 shrink-0
        rounded-2xl p-6 flex flex-col justify-between
        bg-white/10 backdrop-blur-xl
        border border-white/15
        shadow-[0_10px_40px_rgba(0,0,0,0.35)]
        overflow-hidden
      "
    >
      {/* Accent glow */}
{/* Background glow */}
<div
  className={`absolute inset-0 -z-10 rounded-2xl 
  bg-linear-to-br ${accentColor}
  opacity-20 blur-2xl`}
 />


      {/* Text */}
      <p className="relative z-10 text-sm leading-relaxed text-white/80 line-clamp-4">
        “{text}”
      </p>

      {/* Footer */}
      <div className="relative z-10 flex items-center gap-3 pt-4">
        <div
          className={`h-11 w-11 rounded-full bg-linear-to-br ${accentColor}
          flex items-center justify-center text-white font-semibold`}
        >
          {name.charAt(0)}
        </div>

        <div className="leading-tight">
          <p className="text-sm font-semibold text-white">
            {name}
          </p>
          <p className="text-xs text-white/60">
            {role}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
