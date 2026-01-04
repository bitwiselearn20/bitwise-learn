"use client";

import { Users, Monitor, FileText } from "lucide-react";
import { motion, Variants } from "framer-motion";

const cardVariants : Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function OurTeam() {
  return (
    <section className="w-full bg-bg py-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-6xl font-semibold pt-16 text-white">
            Our <span className="text-blue-600">Team</span>
          </h2>
          <p className="mt-3 text-sm md:text-base text-white/60">
            The experts behind our world-class training and platform.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TeamCard
            icon={<Users className="h-6 w-6" />}
            title="Training Team"
            description="IIT/NIT alumni and tech specialists with deep industry experience fostering a strong mentorship culture."
          />

          <TeamCard
            icon={<Monitor className="h-6 w-6" />}
            title="Platform Development Team"
            description="Dedicated engineers building our Student and Faculty portals with analytics and progress tracking."
          />

          <TeamCard
            icon={<FileText className="h-6 w-6" />}
            title="Content Development Team"
            description="Creating industry-standard coding problems, projects, assessments, and quizzes."
          />
        </div>
      </div>
    </section>
  );
}

function TeamCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 0 40px rgba(96,165,250,0.5)", // blue-400 glow
      }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="relative rounded-2xl bg-[#111215] border border-white/10 p-8 text-center"
    >
      {/* Icon */}
      <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600/15 text-blue-500">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-white mb-3">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm leading-relaxed text-white/65">
        {description}
      </p>
    </motion.div>
  );
}
