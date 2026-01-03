"use client"
import V1HomeNav from "./V1HomeNav";
import Image from "next/image";
import bgIMG from "./V1bgIMG.png";
import { Klee_One } from "next/font/google";
import Chart from "./Chart.png";
import { motion } from "framer-motion";

import {
  Lightbulb,
  Play,
  ClipboardCheck,
  TrendingUp,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

const kleeOne = Klee_One({
  subsets: ["latin"],
  weight: ["400", "600"],
});

function V1Home() {
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.18, // delay between cards
      },
    },
  };
  
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 40,
      rotateX: -8,
      scale: 0.96,
    },
    show: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };
  
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* Background */}
      <Image
        src={bgIMG}
        alt="Background"
        fill
        priority
        className="object-cover -z-10"
      />

      {/* Navbar */}
      <V1HomeNav />

      {/* Main wrapper */}
      <main className="pt-20 mt-20">
        {/* ================= HERO ================= */}
        <section
          className={`${kleeOne.className}
          flex flex-col items-center justify-center
          text-center
          -translate-y-6`}
        >
          <h1 className="text-6xl md:text-7xl tracking-widest font-normal">
            Learn. Code. Grow.
          </h1>

          <p className="mt-4 max-w-xl text-sm md:text-base text-white/80 leading-relaxed font-semibold">
            Designed to help you learn better, stay on track
            <br />
            and grow with purpose.
          </p>
        </section>

        {/* ================= CARDS ================= */}
        <section className={`${kleeOne.className} mt-16`}>
          <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-w-7xl mx-auto px-6 grid grid-cols-3 gap-8 items-start">
            {/* ================= CARD 1 ================= */}
            <motion.div
  variants={cardVariants}
  className="relative rounded-2xl px-6 py-10 bg-white/6 border 
  border-white/12 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.45)]
  transition-all duration-500 ease-out
  hover:-translate-y-3
  hover:rotate-y-6
  hover:-rotate-x-3
  transform-3d
  perspective-[1000px]"
>

              <div className="absolute inset-0 rounded-2xl bg-linear-to-b from-white/[0.14] to-transparent pointer-events-none" />

              <h3 className="relative text-2xl font-medium tracking-wide text-white/90">
                Your Learning Progress
              </h3>

              <div className="relative mt-[-20] flex items-end justify-between">
                <Image src={Chart} alt="Chart.png" height={130} />
                <div className="text-right">
                  <p className="text-4xl font-semibold">75%</p>
                  <p className="text-md text-white/60">Complete</p>
                </div>
              </div>

              <p className="relative mt-4 text-lg text-white/70 leading-relaxed text-center">
                Stay consistent and
                <br />
                see your skills grow over time.
              </p>
            </motion.div>

            {/* ================= CARD 2 ================= */}
            <motion.div
  variants={cardVariants}
  className="relative flex justify-center transition-all duration-500 ease-out
  hover:-translate-y-4
  hover:-rotate-x-6
  transform-3d
  perspective-[1000px]"
>

              <div
                className="relative w-full max-w-[360px] h-[360px]
    rounded-2xl px-6 py-6
    bg-white/6 border border-white/12
    backdrop-blur-xl
    shadow-[0_20px_40px_rgba(0,0,0,0.45)]
    overflow-hidden"
              >
                {/* inner glow */}
                <div className="absolute inset-0 rounded-2xl bg-linear-to-b from-white/[0.14] to-transparent pointer-events-none" />

                {/* Title */}
                <h3 className="relative text-2xl font-medium tracking-wide text-white/90 text-center">
                  Your Learning Path
                </h3>

                {/* FLOW AREA */}
                <div className="relative mt-6 h-[230px]">

                  {/* SVG CONNECTOR LINES */}
                  <svg
                    className="absolute inset-0"
                    viewBox="0 0 360 230"
                    fill="none"
                  >
                    {/* Lesson -> Task */}
                    <path
                      d="M140 45 H180 V45 H220"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />

                    {/* Task -> Quiz */}
                    <path
                      d="
                        M240 92
                        V150
                        Q240 160 230 160
                        H110
                        Q100 160 100 170
                        V174
                      "
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      fill="none"
                    />


                  </svg>

                  {/* Lesson */}
                  <div
                    className="absolute left-0 top-0 w-[120px] h-[80px]
        rounded-xl border-2 border-white
        flex flex-col items-center justify-center gap-1 bg-black/20"
                  >
                    <Play size={22} fill="white" />
                    <span className="text-base">Lesson</span>
                  </div>

                  {/* Task */}
                  <div
                    className="absolute right-0 top-0 w-[120px] h-[80px]
        rounded-xl border-2 border-white
        flex flex-col items-center justify-center gap-1 bg-black/20"
                  >
                    <ClipboardCheck size={22} />
                    <span className="text-base">Task</span>
                  </div>

                  {/* Quiz */}
                  <div
                    className="absolute left-0 bottom-0 w-[120px] h-[80px]
        rounded-xl border-2 border-white
        flex flex-col items-center justify-center gap-1 bg-black/20"
                  >
                    <Lightbulb size={22} />
                    <span className="text-base">Quiz</span>
                  </div>

                  {/* Description next to Quiz */}
                  <p
                    className="absolute left-[140px] bottom-[10px]
        text-sm text-white/80 leading-relaxed max-w-[180px]"
                  >
                    Follow a structured path with lessons,
                    tasks and checkpoints
                  </p>
                </div>
              </div>
            </motion.div>




            {/* ================= CARD 3 ================= */}
            <motion.div
  variants={cardVariants}
  className="relative rounded-2xl px-6 py-6 bg-white/6 border border-white/12 
  backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.45)]
  transition-all duration-500 ease-out
  hover:-translate-y-3
  hover:-rotate-y-6
  hover:-rotate-x-3
  transform-3d
  perspective-[1000px]"
>

              <div className="absolute inset-0 rounded-2xl bg-linear-to-b from-white/[0.14] to-transparent pointer-events-none" />

              <h3 className="relative text-2xl font-medium tracking-wide text-white/90 flex items-center gap-2">
                Learning Insights
                <Lightbulb size={35} />
              </h3>

              <h1 className="text-lg">What should I do next?</h1>

              <ul className="relative mt-4 space-y-3 text-sm">
                <li className="flex items-center gap-2 text-white/80">
                  <CheckCircle2 size={16} className="text-blue-400" />
                  Which topic needs more practice?
                </li>

                <li className="flex items-center gap-2 text-white/80">
                  <HelpCircle size={16} className="text-red-400" />
                  Where am I stuck?
                </li>

                <li className="flex items-center gap-2 text-white/80">
                  <CheckCircle2 size={16} className="text-green-400" />
                  How consistent am I?
                </li>
              </ul>

              <p className="relative mt-4 text-xl text-white/70 leading-relaxed">
                Get clarity from your learning
                <br />
                data and improve faster.
              </p>
            </motion.div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}

export default V1Home;
