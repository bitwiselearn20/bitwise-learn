"use client";
const initialData = [
  {
    student: {
      name: "Aarav Sharma",
      batch: "Batch 25",
      rollNumber: "B25-001",
      email: "aarav.sharma@example.com",
    },
    startedAt: "2026-02-01T10:01:12.000Z",
    submittedAt: "2026-02-01T11:42:45.000Z",
    totalMarks: 82,
    studentIp: "192.168.1.14",
    proctoringStatus: "CLEAN",
  },
  {
    student: {
      name: "Neha Verma",
      batch: "Batch 25",
      rollNumber: "B25-004",
      email: "neha.verma@example.com",
    },
    startedAt: "2026-02-01T10:05:33.000Z",
    submittedAt: "2026-02-01T11:55:02.000Z",
    totalMarks: 91,
    studentIp: "192.168.1.22",
    proctoringStatus: "CLEAN",
  },
  {
    student: {
      name: "Rohit Mehta",
      batch: "Batch 25",
      rollNumber: "B25-009",
      email: "rohit.mehta@example.com",
    },
    startedAt: "2026-02-01T10:00:05.000Z",
    submittedAt: "2026-02-01T10:48:18.000Z",
    totalMarks: 64,
    studentIp: "10.0.0.15",
    proctoringStatus: "SUSPICIOUS",
  },
  {
    student: {
      name: "Sneha Iyer",
      batch: "Batch 25",
      rollNumber: "B25-013",
      email: "sneha.iyer@example.com",
    },
    startedAt: "2026-02-01T10:12:49.000Z",
    submittedAt: "2026-02-01T12:00:00.000Z",
    totalMarks: 47,
    studentIp: "172.16.4.33",
    proctoringStatus: "MALPRACTICE",
  },
  {
    student: {
      name: "Kunal Singh",
      batch: "Batch 25",
      rollNumber: "B25-018",
      email: "kunal.singh@example.com",
    },
    startedAt: "2026-02-01T10:03:21.000Z",
    submittedAt: "2026-02-01T11:20:10.000Z",
    totalMarks: 76,
    studentIp: "192.168.0.88",
    proctoringStatus: "CLEAN",
  },
];

import { getStudentData } from "@/api/reports/get-assessment-report";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type ReportRow = {
  student: {
    name: string;
    batch: string;
    rollNumber: string;
    email: string;
  };
  startedAt: string;
  submittedAt: string;
  totalMarks: number;
  studentIp: string;
  proctoringStatus: string;
};

const STATUS_COLORS: Record<string, string> = {
  CLEAN: "#22c55e",
  SUSPICIOUS: "#facc15",
  MALPRACTICE: "#ef4444",
};

function IndividualAssessmentReportV1({
  assessmentId,
}: {
  assessmentId: string;
}) {
  const [assessmentInfo, setAssessmentInfo] =
    useState<ReportRow[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | "">("");

  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function handleLoad() {
      // setLoading(true);
      // await getStudentData(assessmentId, pageNumber, setAssessmentInfo);
      // setLoading(false);
    }
    handleLoad();
  }, [assessmentId, pageNumber]);

  const stats = useMemo(() => {
    const total = assessmentInfo.length;
    const avg =
      total === 0
        ? 0
        : Math.round(
            assessmentInfo.reduce((a, b) => a + b.totalMarks, 0) / total,
          );

    const statusCount = assessmentInfo.reduce(
      (acc: Record<string, number>, curr) => {
        acc[curr.proctoringStatus] = (acc[curr.proctoringStatus] || 0) + 1;
        return acc;
      },
      {},
    );

    return { total, avg, statusCount };
  }, [assessmentInfo]);

  const proctoringChartData = Object.entries(stats.statusCount).map(
    ([key, value]) => ({
      name: key,
      value,
    }),
  );

  async function downloadStudentReport(student: ReportRow) {
    if (!reportRef.current) return;

    const reportEl = reportRef.current;

    // Make the div temporarily visible off-screen
    reportEl.style.position = "absolute";
    reportEl.style.left = "-9999px";
    reportEl.style.top = "0";
    reportEl.style.display = "block";

    // A4 size in pixels @ 96dpi
    const canvasWidth = 794; // px
    const canvasHeight = 1123; // px
    reportEl.style.width = `${canvasWidth}px`;
    reportEl.style.minHeight = `${canvasHeight}px`;
    reportEl.style.boxSizing = "border-box";

    // Format dates
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    // Calculate duration
    const calculateDuration = (start: string, end: string) => {
      const startTime = new Date(start).getTime();
      const endTime = new Date(end).getTime();
      const diffMs = endTime - startTime;
      const diffMins = Math.floor(diffMs / 60000);
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    const marksPercent = student.totalMarks;
    const duration = calculateDuration(student.startedAt, student.submittedAt);

    // Determine status color
    const getStatusColor = (status: string) => {
      const s = status.toLowerCase();
      if (s.includes("pass") || s.includes("clean")) return "#10b981";
      if (s.includes("warn") || s.includes("suspicious")) return "#f59e0b";
      return "#ef4444";
    };

    const statusColor = getStatusColor(student.proctoringStatus);

    reportEl.innerHTML = `
    <div style="
      font-family: Arial, sans-serif;
      background-color: #3134fc;
      padding: 10px 40px;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    ">
      <!-- Header -->
      <div style="
        background-color: #ffffff;
        border-radius: 16px;
        padding: 32px;
        margin-bottom: 24px;
      ">
        <div style="margin-bottom: 8px;">
          <div style="display: inline-block; vertical-align: top; width: 70%;">
            <h1 style="
              font-size: 32px;
              font-weight: 700;
              color: #1a202c;
              margin: 0 0 4px 0;
            ">Bitwise Learn</h1>
            <p style="
              font-size: 14px;
              color: #718096;
              margin: 0;
            ">Assessment Performance Report</p>
          </div>
          <div style="
            display: inline-block;
            vertical-align: top;
            background-color: #3134fc;
            width: 60px;
            height: 60px;
            border-radius: 12px;
            text-align: center;
            line-height: 60px;
            color: #ffffff;
            font-size: 24px;
            font-weight: 700;
          ">BL</div>
        </div>
        <div style="
          height: 3px;
          background-color: #3134fc;
          border-radius: 2px;
          margin-top: 16px;
        "></div>
      </div>

      <!-- Student Information Card -->
      <div style="
        background-color: #ffffff;
        border-radius: 16px;
        padding: 28px 32px;
        margin-bottom: 24px;
      ">
        <h2 style="
          font-size: 18px;
          font-weight: 600;
          color: #2d3748;
          margin: 0 0 20px 0;
          padding-bottom: 12px;
          border-bottom: 2px solid #e2e8f0;
        ">Student Information</h2>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 50%; padding: 8px 16px 8px 0; vertical-align: top;">
              <p style="font-size: 12px; color: #718096; margin: 0 0 4px 0;">FULL NAME</p>
              <p style="font-size: 16px; color: #1a202c; margin: 0; font-weight: 500;">${student.student.name}</p>
            </td>
            <td style="width: 50%; padding: 8px 0 8px 16px; vertical-align: top;">
              <p style="font-size: 12px; color: #718096; margin: 0 0 4px 0;">BATCH</p>
              <p style="font-size: 16px; color: #1a202c; margin: 0; font-weight: 500;">${student.student.batch}</p>
            </td>
          </tr>
          <tr>
            <td style="width: 50%; padding: 8px 16px 8px 0; vertical-align: top;">
              <p style="font-size: 12px; color: #718096; margin: 0 0 4px 0;">ROLL NUMBER</p>
              <p style="font-size: 16px; color: #1a202c; margin: 0; font-weight: 500;">${student.student.rollNumber}</p>
            </td>
            <td style="width: 50%; padding: 8px 0 8px 16px; vertical-align: top;">
              <p style="font-size: 12px; color: #718096; margin: 0 0 4px 0;">EMAIL ADDRESS</p>
              <p style="font-size: 14px; color: #1a202c; margin: 0; font-weight: 500;">${student.student.email}</p>
            </td>
          </tr>
        </table>
      </div>

      <!-- Performance Overview -->
      <div style="
        background-color: #ffffff;
        border-radius: 16px;
        padding: 28px 32px;
        margin-bottom: 24px;
      ">
        <h2 style="
          font-size: 18px;
          font-weight: 600;
          color: #2d3748;
          margin: 0 0 24px 0;
          padding-bottom: 12px;
          border-bottom: 2px solid #e2e8f0;
        ">Performance Overview</h2>
        
        <table style="width: 100%;">
          <tr>
            <td style="width: 60%; vertical-align: top; padding-right: 40px;">
              <div style="margin-bottom: 20px;">
                <p style="font-size: 12px; color: #718096; margin: 0 0 4px 0;">SCORE OBTAINED</p>
                <p style="font-size: 36px; color: #3134fc; margin: 0; font-weight: 700;">${student.totalMarks}%</p>
              </div>
              
              <table style="width: 100%; margin-top: 24px; border-collapse: collapse;">
                <tr>
                  <td style="width: 50%; padding: 8px 16px 8px 0; vertical-align: top;">
                    <p style="font-size: 12px; color: #718096; margin: 0 0 4px 0;">STARTED AT</p>
                    <p style="font-size: 14px; color: #1a202c; margin: 0; font-weight: 500;">${formatDate(student.startedAt)}</p>
                  </td>
                  <td style="width: 50%; padding: 8px 0 8px 16px; vertical-align: top;">
                    <p style="font-size: 12px; color: #718096; margin: 0 0 4px 0;">SUBMITTED AT</p>
                    <p style="font-size: 14px; color: #1a202c; margin: 0; font-weight: 500;">${formatDate(student.submittedAt)}</p>
                  </td>
                </tr>
                <tr>
                  <td style="width: 50%; padding: 8px 16px 8px 0; vertical-align: top;">
                    <p style="font-size: 12px; color: #718096; margin: 0 0 4px 0;">DURATION</p>
                    <p style="font-size: 14px; color: #1a202c; margin: 0; font-weight: 500;">${duration}</p>
                  </td>
                  <td style="width: 50%; padding: 8px 0 8px 16px; vertical-align: top;">
                    <p style="font-size: 12px; color: #718096; margin: 0 0 4px 0;">IP ADDRESS</p>
                    <p style="font-size: 14px; color: #1a202c; margin: 0; font-weight: 500;">${student.studentIp}</p>
                  </td>
                </tr>
              </table>
            </td>

            <!-- Circular Progress -->
            <td style="width: 40%; text-align: center; vertical-align: middle;">
              <svg viewBox="0 0 120 120" style="width: 160px; height: 160px;">
                <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" stroke-width="8"/>
                <circle 
                  cx="60" 
                  cy="60" 
                  r="54" 
                  fill="none" 
                  stroke="#3134fc" 
                  stroke-width="8"
                  stroke-dasharray="${(marksPercent * 339.292) / 100} 339.292"
                  stroke-linecap="round"
                  transform="rotate(-90 60 60)"
                />
                <text x="60" y="65" text-anchor="middle" font-size="28" font-weight="700" fill="#1a202c">
                  ${marksPercent}%
                </text>
              </svg>
            </td>
          </tr>
        </table>
      </div>

      <!-- Proctoring Status -->
      <div style="
        background-color: #ffffff;
        border-radius: 16px;
        padding: 28px 32px;
      ">
        <h2 style="
          font-size: 18px;
          font-weight: 600;
          color: #2d3748;
          margin: 0 0 20px 0;
          padding-bottom: 12px;
          border-bottom: 2px solid #e2e8f0;
        ">Proctoring Status</h2>
        
        <div style="
          background-color: ${statusColor}22;
          border-left: 4px solid ${statusColor};
          padding: 16px 20px;
          border-radius: 8px;
        ">
          <p style="
            font-size: 16px;
            color: ${statusColor};
            margin: 0;
            font-weight: 600;
          ">${student.proctoringStatus}</p>
        </div>
      </div>

      <!-- Footer -->
      <div style="
        margin-top: 16px;
        padding-top: 20px;
        border-top: 2px solid rgba(255, 255, 255, 0.3);
        text-align: center;
      ">
        <p style="font-size: 12px; color: #ffffff; margin: 0;">
          Generated on ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>
        <p style="font-size: 11px; color: rgba(255, 255, 255, 0.8); margin: 4px 0 0 0;">
          © ${new Date().getFullYear()} Bitwise Learn. All rights reserved.
        </p>
      </div>
    </div>
  `;

    // Force reflow and wait for rendering
    reportEl.getBoundingClientRect();
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Capture PDF using html2canvas
    const canvas = await html2canvas(reportEl, {
      scale: 2,
      backgroundColor: "#6366f1",
      useCORS: true,
      logging: false,
      onclone: (doc) => {
        const root = doc.querySelector("[data-report-root]") as HTMLElement;
        if (!root) return;

        // Force safe HEX colors
        root.style.backgroundColor = "#3134fc";
        root.style.color = "#1a202c"; // default text color

        // Walk through all children and fix colors
        root.querySelectorAll("*").forEach((el) => {
          const element = el as HTMLElement;

          // Force text colors to HEX
          if (element.style.color) {
            element.style.color = element.style.color; // preserves current, but avoids lab()
          }
          if (element.style.backgroundColor) {
            element.style.backgroundColor = element.style.backgroundColor; // preserves HEX
          }

          // Remove any computed lab() or hsl() colors
          const computed = getComputedStyle(element);
          if (computed.color.includes("lab")) element.style.color = "#1a202c";
          if (computed.backgroundColor.includes("lab"))
            element.style.backgroundColor = "#ffffff";
        });
      },
    });

    // Hide the div again
    reportEl.style.display = "none";

    // Convert canvas to PDF
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = 210; // mm
    const pdfHeight = 297; // mm

    // Fit the canvas proportionally into A4
    let imgWidth = pdfWidth;
    let imgHeight = (canvas.height * pdfWidth) / canvas.width;

    if (imgHeight > pdfHeight) {
      const scaleFactor = pdfHeight / imgHeight;
      imgWidth = imgWidth * scaleFactor;
      imgHeight = pdfHeight;
    }

    // Add the image to PDF (single page)
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`${student.student.name}-Bitwise-Learn-Report.pdf`);
  }
  if (loading) {
    return (
      <div className="p-6 text-neutral-400 animate-pulse">
        Loading assessment report...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div
        ref={reportRef}
        data-report-root
        className="hidden bg-neutral-900 text-white p-6 rounded-lg w-[210mm]"
      ></div>
      <div>
        <div>
          <h1 className="text-xl font-semibold text-white">
            Assessment Report
          </h1>
          <p className="text-sm text-neutral-400">
            Performance & proctoring overview
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Students" value={stats.total} />
          <StatCard title="Average Score" value={`${stats.avg}%`} />
          <StatCard
            title="Malpractice Cases"
            value={stats.statusCount["MALPRACTICE"] || 0}
            danger
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={assessmentInfo}>
                <XAxis dataKey="student.name" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalMarks" fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={proctoringChartData}
                  dataKey="value"
                  outerRadius={100}
                >
                  {proctoringChartData.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name, roll number or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 rounded border border-neutral-700 bg-neutral-900 text-white placeholder-neutral-400 w-full md:w-1/2"
        />

        {/* Status Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded border border-neutral-700 bg-neutral-900 text-white w-full md:w-1/4"
        >
          <option value="">All Status</option>
          <option value="CLEAN">CLEAN</option>
          <option value="SUSPICIOUS">SUSPICIOUS</option>
          <option value="MALPRACTICE">MALPRACTICE</option>
        </select>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-800 text-neutral-400">
            <tr>
              <th className="px-4 py-3 text-left">Student</th>
              <th className="px-4 py-3">Roll No</th>
              <th className="px-4 py-3">Marks</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Ip</th>
              <th className="px-4 py-3 text-right">Download Report</th>
            </tr>
          </thead>
          <tbody>
            {assessmentInfo
              .filter((row) => {
                // Search filter: name, roll number, email
                const term = searchTerm.toLowerCase();
                const matchesSearch =
                  row.student.name.toLowerCase().includes(term) ||
                  row.student.rollNumber.toLowerCase().includes(term) ||
                  row.student.email.toLowerCase().includes(term);

                // Status filter
                const matchesStatus =
                  !statusFilter || row.proctoringStatus === statusFilter;

                return matchesSearch && matchesStatus;
              })
              .map((row, i) => (
                <tr
                  key={i}
                  className="border-t border-neutral-800 hover:bg-neutral-800/40"
                >
                  <td className="px-4 py-3 text-white">{row.student.name}</td>
                  <td className="px-4 py-3 text-neutral-300">
                    {row.student.rollNumber}
                  </td>
                  <td className="px-4 py-3 text-neutral-300">
                    {row.totalMarks}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded text-xs text-neutral-300 font-medium">
                      {row.studentIp}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{
                        backgroundColor:
                          STATUS_COLORS[row.proctoringStatus] + "22",
                        color: STATUS_COLORS[row.proctoringStatus],
                      }}
                    >
                      {row.proctoringStatus}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => downloadStudentReport(row)}
                      className="text-sm cursor-pointer text-blue-400 hover:underline"
                    >
                      Download PDF
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center">
        <button
          disabled={pageNumber === 0}
          onClick={() => setPageNumber((p) => p - 1)}
          className="px-4 py-2 text-white rounded bg-neutral-800 disabled:opacity-40"
        >
          Prev
        </button>

        <span className="text-sm text-neutral-400">Page {pageNumber + 1}</span>

        <button
          onClick={() => setPageNumber((p) => p + 1)}
          className="px-4 py-2 text-white rounded bg-neutral-800"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  danger,
}: {
  title: string;
  value: string | number;
  danger?: boolean;
}) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
      <p className="text-sm text-neutral-400">{title}</p>
      <p
        className={`text-2xl font-semibold ${
          danger ? "text-red-400" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default IndividualAssessmentReportV1;
