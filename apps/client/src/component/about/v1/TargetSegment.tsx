"use client";

import { motion, Variants } from "framer-motion";
import { Card, CardContent } from "@/component/ui/Card";
import { GraduationCap, Building2, User, Check } from "lucide-react";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function TargetSegments() {

  return (
    <section className="w-full py-24 bg-[#121313]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-5xl mx-auto"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-bold mt-2 text-primary-font"
          >
            Designed for every layer of your
            <span className="text-blue-500"> Ecosystem</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="mt-6 text-lg text-secondary-font"
          >
            Bitwise Learn connects institutes, vendors, and learners through a
            unified learning and training ecosystem.
          </motion.p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Academic */}
          <motion.div
            variants={cardVariants}
            whileHover={{
              y: -10,
              boxShadow: "0 0 40px rgba(96,165,250,0.25)",
            }}
            className="rounded-3xl overflow-hidden h-full"
          >
            <Card className="rounded-3xl h-full bg-[#1E1E1E] border border-white/10 transition">
              <CardContent className="p-8 flex flex-col h-full">
                <div className="flex items-center justify-between">
                  <div className="h-14 w-14 rounded-2xl bg-[#64ACFF]/20 flex items-center justify-center">
                    <GraduationCap className="h-7 w-7 text-[#64ACFF]" />
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#64ACFF]/10 text-[#64ACFF] border border-[#64ACFF]/30">
                    ACADEMIC
                  </span>
                </div>

                <h3 className="mt-8 text-2xl font-semibold text-primary-font">
                  Institutes & Universities
                </h3>

                <p className="mt-4 text-secondary-font">
                  Deliver structured, measurable training outcomes for your
                  students across semesters, labs, and placement seasons.
                </p>

                <ul className="mt-8 space-y-4">
                  {[
                    "Central admin & department dashboards",
                    "Batch, course & assessment management",
                    "Placement-focused training paths",
                    "Data-driven reports for management",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="h-5 w-5 rounded-full bg-[#64ACFF]/20 flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 text-[#64ACFF]" />
                      </span>
                      <span className="text-secondary-font">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Vendor */}
          <motion.div
            variants={cardVariants}
            whileHover={{
              y: -10,
              boxShadow: "0 0 40px rgba(147,197,253,0.35)",
            }}
            className="rounded-3xl overflow-hidden h-full"
          >
            <Card className="rounded-3xl bg-[#1E1E1E] h-full border border-white/10 transition">
              <CardContent className="p-8 flex flex-col h-full">
                <div className="flex items-center justify-between">
                  <div className="h-14 w-14 rounded-2xl bg-[#64ACFF]/20 flex items-center justify-center">
                    <Building2 className="h-7 w-7 text-[#64ACFF]" />
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#64ACFF]/10 text-[#64ACFF] border border-[#64ACFF]/30">
                    VENDOR
                  </span>
                </div>

                <h3 className="mt-8 text-2xl font-semibold text-primary-font">
                  Training Vendors & Companies
                </h3>

                <p className="mt-4 text-secondary-font">
                  Manage your students, trainers, and partner institutes with
                  one robust SaaS backbone.
                </p>

                <ul className="mt-8 space-y-4">
                  {[
                    "Vendor-specific panels & branding",
                    "Trainer & batch allocation tools",
                    "Performance & revenue tracking",
                    "White-label implementation support",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="h-5 w-5 rounded-full bg-[#64ACFF]/20 flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 text-[#64ACFF]" />
                      </span>
                      <span className="text-secondary-font">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Student */}
          <motion.div
            variants={cardVariants}
            whileHover={{
              y: -10,
              boxShadow: "0 0 40px rgba(96,165,250,0.25)",
            }}
            className="rounded-3xl overflow-hidden h-full"
          >
            <Card className="rounded-3xl bg-[#1E1E1E] h-full border border-white/10 transition">
              <CardContent className="p-8 flex flex-col h-full">
                <div className="flex items-center justify-between">
                  <div className="h-14 w-14 rounded-2xl bg-[#64ACFF]/20 flex items-center justify-center">
                    <User className="h-7 w-7 text-[#64ACFF]" />
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#64ACFF]/10 text-[#64ACFF] border border-[#64ACFF]/30">
                    STUDENT
                  </span>
                </div>

                <h3 className="mt-8 text-2xl font-semibold text-primary-font">
                  Individual Learners
                </h3>

                <p className="mt-4 text-secondary-font">
                  Students and job-seekers can access guided learning paths,
                  practice content, and assessments.
                </p>

                <ul className="mt-8 space-y-4">
                  {[
                    "DSA & problem-solving practice",
                    "Placement & certification-oriented courses",
                    "Assessments with detailed analytics",
                    "Self-paced or mentor-led options",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="h-5 w-5 rounded-full bg-[#64ACFF]/20 flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 text-[#64ACFF]" />
                      </span>
                      <span className="text-secondary-font">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
