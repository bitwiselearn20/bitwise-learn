"use client";

import axios from "axios";
import { useRouter } from "next/router";

interface Prop {
  email: string;
  password: string;
  role: "STUDENT" | "INSTITUTION" | "ADMIN" | "VENDOR" | "TEACHER";
}
async function handleLogin({ data }: { data: Prop }) {
  const response = await axios.post("/api/login", data);
  localStorage.setItem("role", data.role);
  // store token in cookies
}
export default handleLogin;
