"use client";
import { Search } from "lucide-react";
import { useMemo, useState, useEffect } from "react";

export type Item = {
  id: number;
  name?: string;
  batchname?: string;
};

function Filter({
  data,
  setFilteredData,
}: {
  data: Item[];
  setFilteredData: any;
}) {
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    return data.filter((item: Item) => {
      const value = item.name ?? item.batchname ?? "";
      return value.toLowerCase().includes(search.toLowerCase());
    });
  }, [data, search]);
  useEffect(() => {
    setFilteredData(filteredData);
  }, [filteredData, setFilteredData]);

  return (
    <div className="relative mb-3">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
      />
      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pl-9 pr-3 py-2 bg-black/30 text-white rounded-lg outline-none focus:ring-1 focus:ring-primaryBlue"
      />
    </div>
  );
}

export default Filter;
