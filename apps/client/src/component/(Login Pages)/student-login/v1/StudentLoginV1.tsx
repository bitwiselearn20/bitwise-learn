"use client";

import StudentLoginIMG from "../v1/StudentLoginIMG.png";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import handleLogin from "@/api/handleLogin";
import { useRouter } from "next/navigation";

/* ================= ANIMATION VARIANTS ================= */

const pageFade = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const slideUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const imageReveal = {
  hidden: { opacity: 0, scale: 1.05 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

/* ================= TYPEWRITER ================= */

function WelcomeTypewriter() {
  const fullText = "Learn a little today. Grow a lot tomorrow.";

  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const speed = isDeleting ? 30 : 40;

    const timeout = setTimeout(() => {
      if (!isDeleting && index < fullText.length) {
        setText(fullText.slice(0, index + 1));
        setIndex(index + 1);
      } else if (isDeleting && index > 0) {
        setText(fullText.slice(0, index - 1));
        setIndex(index - 1);
      } else if (!isDeleting && index === fullText.length) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && index === 0) {
        setIsDeleting(false);
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [index, isDeleting]);

  const renderText = () => {
    const parts = text.split(/(Learn|Grow)/g);

    return parts.map((part, i) =>
      part === "Learn" || part === "Grow" ? (
        <span key={i} className="text-primaryBlue">
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      ),
    );
  };

  return (
    <motion.p
      variants={slideUp}
      className="mt-8 text-xl text-neutral-400 h-5 text-center md:text-left"
    >
      {renderText()}
    </motion.p>
  );
}

/* ================= MAIN COMPONENT ================= */

export default function AdminLoginV1() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function fetchLoginData(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const payload = {
      email,
      password,
      role: "STUDENT" as const,
    };

    console.log(payload);

    try {
      setLoading(true);
      await handleLogin({ data: payload });
      router.push("/dashboard");
    } catch (err) {
      console.error("Login failed", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      variants={pageFade}
      initial="hidden"
      animate="show"
      className="bg-bg min-h-screen w-screen flex flex-col md:flex-row"
    >
      {/* LEFT SECTION */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="flex-1 flex flex-col px-6 py-10 md:p-16"
      >
        <motion.div
          variants={slideUp}
          className="flex justify-center md:justify-start"
        >
          <h1 className="text-3xl">
            <span className="text-primaryBlue font-bold">B</span>
            <span className="font-bold text-white">itwise</span>{" "}
            <span className="text-white">Learn</span>
          </h1>
        </motion.div>

        <motion.div
          variants={slideUp}
          className="relative w-full md:w-[60%] h-auto md:h-[70%] bg-divBg mt-10 md:mt-16 md:ml-16 rounded-3xl p-8"
        >
          <h1 className="text-2xl font-bold mb-6">
            <span className="text-white">Log</span>{" "}
            <span className="text-primaryBlue">in</span>
          </h1>

          <motion.form
            variants={stagger}
            onSubmit={fetchLoginData}
            className="space-y-6"
          >
            {/* EMAIL */}
            <motion.div variants={slideUp} className="flex flex-col space-y-1">
              <label htmlFor="email" className="text-lg text-white">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute top-1/2 left-3 -translate-y-1/2">
                  <Mail size={24} color="white" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 py-2 pr-4 rounded-lg bg-bg text-white
                  focus:ring-2 focus:ring-primaryBlue focus:ring-offset-2 outline-none
                  focus:ring-offset-bg"
                  placeholder="johndoe@example.com"
                  required
                />
              </div>
            </motion.div>

            {/* PASSWORD */}
            <motion.div variants={slideUp} className="mt-4">
              <label htmlFor="password" className="text-lg text-white">
                Password
              </label>
              <div className="relative">
                <div className="absolute top-1/2 left-3 -translate-y-1/2">
                  <Lock size={24} color="white" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 py-2 pr-4 rounded-lg bg-bg text-white
                  focus:ring-2 focus:ring-primaryBlue focus:ring-offset-2 outline-none
                  focus:ring-offset-bg"
                  placeholder="123@somePass"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-white"
                >
                  {showPassword ? <Eye size={17} /> : <EyeOff size={17} />}
                </button>
              </div>
            </motion.div>

            {/* SUBMIT */}
            <motion.button
              variants={slideUp}
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-primaryBlue
              text-white text-lg font-semibold
              hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Log in"}
            </motion.button>

            <motion.div variants={slideUp}>
              <button
                type="button"
                className="text-sm text-neutral-300 hover:text-primaryBlue transition"
              >
                Forgot Password?
              </button>
            </motion.div>
          </motion.form>
        </motion.div>

        <WelcomeTypewriter />
      </motion.div>

      {/* RIGHT IMAGE */}
      <motion.div
        variants={imageReveal}
        initial="hidden"
        animate="show"
        className="relative hidden lg:block lg:w-[38%] lg:h-screen"
      >
        <Image
          src={StudentLoginIMG}
          alt="Admin login illustration"
          fill
          className="object-cover"
          priority
        />
      </motion.div>
    </motion.div>
  );
}
