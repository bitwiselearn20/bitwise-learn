"use client"

type LoginRole = "Instructor" | "Institution" | "Partner";


import MutliLoginIMG from "../v1/MultiLoginIMG.png"
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, GraduationCap, School, Handshake } from "lucide-react";
import { useState, useEffect } from "react";


function WelcomeTypewriter() {
    const fullText = "Teach with purpose. Lead with impact.";
  
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
      const parts = text.split(/(Teach|Lead)/g);
  
      return parts.map((part, i) =>
        part === "Teach" || part === "Lead" ? (
          <span key={i} className="text-primaryBlue">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      );
    };
  
    return (
      <p className="mt-8 text-xl text-neutral-400 h-5 text-center md:text-left">
        {renderText()}
      </p>
    );
  }
  


export default function AdminLoginV1() {

    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState<LoginRole>("Instructor");

    async function fetchLoginData(formData: FormData) {
        const email = formData.get("email");
        const password = formData.get("password");
        const remember = formData.get("remember");
        const role = formData.get("role");

        console.log(email, password, remember, role);
    }

    return (
        <div className="bg-bg min-h-screen w-screen flex flex-col md:flex-row">

            <div className="flex-1 flex flex-col px-6 py-10 md:p-16">

                <div className="flex justify-center md:justify-start">
                    <h1 className="text-3xl">
                        <span className="text-primaryBlue font-bold">B</span>
                        <span className="font-bold text-white">itwise</span>{" "}
                        <span className="text-white">Learn</span>
                    </h1>
                </div>

                <div className="relative w-full md:w-[60%] h-auto md:h-[70%] bg-divBg mt-10 md:mt-16 md:ml-16 rounded-3xl p-8 pt-4">

                    <h1 className="text-2xl font-bold mb-2">
                        <span className="text-white">Log</span>{" "}
                        <span className="text-primaryBlue">in</span>
                    </h1>

                    <form action={fetchLoginData} className="space-y-6">

                    <div className="bg-bg rounded-xl flex flex-wrap gap-2 justify-center md:justify-around items-center p-2">
                        <input type="hidden" name="role" value={role} />
                            <button 
                                type="button"
                                onClick={()=> setRole("Instructor")}
                                className={`px-2 py-2 rounded-lg transition flex items-center
                                    gap-2
                                ${role==="Instructor"
                                    ? "bg-primaryBlue text-slate "
                                    : "bg-[#3B82F6]"
                                }
                                `}
                            >   
                                <GraduationCap size={20} color="white"/>
                                Instructor
                            </button>
                            <button 
                                type="button"
                                onClick={()=> setRole("Institution")}
                                className={`px-2 py-2 rounded-lg transition flex items-center
                                    gap-2
                                ${role==="Institution"
                                    ? "bg-primaryBlue text-white"
                                    : "bg-[#3B82F6]"
                                }
                                `}
                            >   
                                <School size={20} color="white"/>
                                Institution
                            </button>
                            <button 
                                type="button"
                                onClick={()=> setRole("Partner")}
                                className={`px-2 py-2 rounded-lg transition flex items-center
                                    gap-2
                                ${role==="Partner"
                                    ? "bg-primaryBlue text-white"
                                    : "bg-[#3B82F6]"
                                }
                                `}
                            >   
                                <Handshake size={20} color="white"/>
                                Partner
                            </button>
                            
                            
                        </div>

                        <div className="flex flex-col space-y-1">
                            <div>
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
                                        className="w-full pl-12 py-2 pr-4 rounded-lg bg-bg text-white
                                        focus:ring-2 focus:ring-primaryBlue focus:ring-offset-2 outline-none
                                        focus:ring-offset-bg"
                                        placeholder="johndoe@example.com"
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
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
                                        className="w-full pl-12 py-2 pr-4 rounded-lg bg-bg text-white
                                        focus:ring-2 focus:ring-primaryBlue focus:ring-offset-2 outline-none
                                        focus:ring-offset-bg"
                                        placeholder="123@somePass"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-white"
                                    >
                                        {showPassword ? <Eye size={17}/> : <EyeOff size={17}/>}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <label className="flex items-center space-x-2 text-white">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    className="w-4 h-4 rounded border border-neutral-500 bg-bg
                                    focus:ring-2 focus:ring-primaryBlue focus:ring-offset-2
                                    focus:ring-offset-bg outline-none"
                                />
                                <span>Remember me</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 rounded-lg bg-primaryBlue
                            text-white text-lg font-semibold
                            hover:opacity-90 transition"
                        >
                            Log in
                        </button>

                        <div>
                            <button
                                type="button"
                                className="text-sm text-neutral-300 hover:text-primaryBlue transition"
                            >
                                Forgot Password?
                            </button>
                        </div>

                    </form>
                </div>

                <WelcomeTypewriter />
            </div>

            <div className="relative hidden lg:block lg:w-[38%] lg:h-screen">
                <Image
                    src={MutliLoginIMG}
                    alt="Admin login illustration"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

        </div>
    );
}
