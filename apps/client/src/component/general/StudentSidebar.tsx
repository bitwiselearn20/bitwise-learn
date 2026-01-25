"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  NotebookPen,
  Code2,
  LayoutDashboard,
  ClipboardCheck,
  LogOut,
  LibraryBig,
  User,
} from "lucide-react";
import { useStudent } from "@/store/studentStore";


const MIN_WIDTH = 60;
const MAX_WIDTH = 420;

export default function StudentSideBar() {
  const [width, setWidth] = useState(220);
  const isResizing = useRef(false);
  const sidebarRef = useRef<HTMLElement | null>(null);

  const { studentInfo, logout } = useStudent();

  const isCollapsed = width <= 80;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current || !sidebarRef.current) return;

      const sidebarLeft = sidebarRef.current.getBoundingClientRect().left;
      const newWidth = e.clientX - sidebarLeft;

      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.body.classList.remove("select-none");
      document.body.style.cursor = "default";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const startResizing = () => {
    isResizing.current = true;
    document.body.classList.add("select-none");
    document.body.style.cursor = "col-resize";
  };

  return (
    <aside
      ref={sidebarRef}
      style={{ width }}
      className="
        relative shrink-0 h-full
        border-r border-white/10
        bg-primary-bg text-white
        flex flex-col
      "
    >
      {/* PROFILE */}
      <div className="px-4 pt-6 pb-4 flex flex-col items-center">
        <div
          className="
            h-16 w-16 rounded-full
            bg-white/10 flex items-center justify-center
            text-primaryBlue
          "
        >
          <User size={28} />
        </div>

        {!isCollapsed && (
          <div className="mt-3 text-center">
            <p className="text-sm font-semibold">
              {studentInfo?.name || "Student"}
            </p>
            <p className="text-xs text-white/50">
              {studentInfo?.batch.batchname}
            </p>
          </div>
        )}
      </div>

      {/* NAVIGATION */}
      <nav className="px-2 py-4 space-y-1">
        <NavLink
          href="/dashboard"
          icon={<LayoutDashboard size={20} />}
          label="Dashboard"
          collapsed={isCollapsed}
        />
        <NavLink
          href="/courses"
          icon={<NotebookPen size={20} />}
          label="Courses"
          collapsed={isCollapsed}
        />
        <NavLink
          href="/problems"
          icon={<Code2 size={20} />}
          label="Problems"
          collapsed={isCollapsed}
        />
        <NavLink
          href="/compiler"
          icon={<ClipboardCheck size={20} />}
          label="Compiler"
          collapsed={isCollapsed}
        />
        <NavLink
          href="/assessments"
          icon={<LibraryBig size={20} />}
          label="Assessments"
          collapsed={isCollapsed}
        />
      </nav>

      {/* LOGOUT */}
      <div className="mt-auto px-2 py-4">
        <button
          onClick={logout}
          className={`
            w-full flex items-center
            ${isCollapsed ? "justify-center px-2" : "gap-3 px-4"}
            py-2.5 rounded-lg
            text-sm font-medium
            text-white/70
            hover:text-red-400
            hover:bg-red-500/10
            transition-all
          `}
        >
          <LogOut size={18} />
          {!isCollapsed && <span>Log out</span>}
        </button>
      </div>

      {/* RESIZE HANDLE */}
      <div
        onMouseDown={startResizing}
        className="
          absolute top-0 right-0 h-full w-1
          cursor-col-resize
          hover:bg-primaryBlue/40
        "
      />
    </aside>
  );
}

function NavLink({
  href,
  icon,
  label,
  collapsed,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}) {
  return (
    <Link href={href} className="block">
      <div
        className={`
          w-full flex items-center
          ${collapsed ? "justify-center px-2" : "gap-3 px-4"}
          py-2.5 rounded-lg
          text-sm font-medium
          text-white/80
          hover:text-white
          hover:bg-white/10
          transition-all
        `}
      >
        {icon}
        {!collapsed && <span>{label}</span>}
      </div>
    </Link>
  );
}
