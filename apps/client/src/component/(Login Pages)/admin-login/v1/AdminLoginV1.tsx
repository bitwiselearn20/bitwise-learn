"use client";

import AdminLoginIMG from "../v1/AdminLoginIMG.png";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import handleLogin from "@/api/handleLogin";
import toast from "react-hot-toast";

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
  const fullText = "Welcome back, Admin!";
  const adminIndex = fullText.indexOf("Admin");

  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const speed = isDeleting ? 40 : 80;

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

  return (
    <motion.p
      variants={slideUp}
      className="mt-8 text-xl text-neutral-400 h-5 text-center md:text-left"
    >
      {text.slice(0, adminIndex)}
      <span className="text-primaryBlue">{text.slice(adminIndex)}</span>
    </motion.p>
  );
}

/* ================= MAIN COMPONENT ================= */

export default function AdminLoginV1() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDisabled = !email || !password || loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        email,
        password,
        role: "ADMIN",
      };

      await handleLogin({ data: payload as any });

      console.log("LOGIN PAYLOAD:", payload);
      toast.success("login successfull");
    } catch (err) {
      setError("Invalid email or password");
      toast.error("login failed");
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
          className="relative w-full md:w-[60%] bg-divBg mt-10 md:mt-16 md:ml-16 rounded-3xl p-8"
        >
          <h1 className="text-2xl font-bold mb-6">
            <span className="text-white">Log</span>{" "}
            <span className="text-primaryBlue">in</span>
          </h1>

          <motion.form
            variants={stagger}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* EMAIL */}
            <motion.div variants={slideUp} className="flex flex-col space-y-1">
              <label className="text-lg text-white">Email Address</label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3 -translate-y-1/2 text-white" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 py-2 pr-4 rounded-lg bg-bg text-white
                  focus:ring-2 focus:ring-primaryBlue focus:ring-offset-2 outline-none
                  focus:ring-offset-bg"
                  placeholder="johndoe@example.com"
                />
              </div>
            </motion.div>

            {/* PASSWORD */}
            <motion.div variants={slideUp}>
              <label className="text-lg text-white">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute top-1/2 left-3 -translate-y-1/2 text-white" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-10 py-2 rounded-lg bg-bg text-white
                  focus:ring-2 focus:ring-primaryBlue focus:ring-offset-2 outline-none
                  focus:ring-offset-bg"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-white"
                >
                  {showPassword ? <Eye size={17} /> : <EyeOff size={17} />}
                </button>
              </div>
            </motion.div>

            {/* REMEMBER */}
            <motion.div variants={slideUp} className="flex items-center">
              <label className="flex items-center space-x-2 text-white">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="accent-primaryBlue"
                />
                <span>Remember me</span>
              </label>
            </motion.div>

            {/* ERROR */}
            {error && (
              <motion.p
                variants={slideUp}
                className="text-red-400 text-sm bg-red-400/10 p-2 rounded-lg"
              >
                {error}
              </motion.p>
            )}

            {/* SUBMIT */}
            <motion.button
              variants={slideUp}
              type="submit"
              disabled={isDisabled}
              className="w-full py-3 rounded-lg bg-primaryBlue
              text-white text-lg font-semibold
              hover:opacity-90 transition
              disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Log in"}
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
          src={AdminLoginIMG}
          alt="Admin login illustration"
          fill
          className="object-cover"
          priority
        />
      </motion.div>
    </motion.div>
  );
}
