"use client";
import { getProblemData } from "@/api/problems/get-individual-problem";
import Problem from "@/component/Problem/Problem";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function page() {
  const [data, setData] = useState({});
  const params = useParams();
  useEffect(() => {
    if (params) {
      getProblemData(setData, params.id as string);
    }
  }, []);
  return (
    <div className="w-full h-screen">
      <Problem data={data} />
    </div>
  );
}

export default page;
