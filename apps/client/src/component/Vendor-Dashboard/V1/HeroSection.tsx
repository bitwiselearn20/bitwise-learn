"use client";

import { useEffect, useState } from "react";
import { getAllStats } from "@/api/admins/get-admin-stats";
import { User } from "lucide-react";
import Link from "next/link";
import { useColors } from "@/component/general/(Color Manager)/useColors";
import { getVendorData } from "@/api/vendors/get-vendor-by-id";
import useVendor from "@/store/vendorStore";

/* ---------------- TYPES ---------------- */

type StatsMap = Record<string, number>;

/*---------------- DUMMY DATA ------------ */

const DUMMY_VENDOR = {
  id: "demo-vendor-id",
  name: "Demo Vendor",
  email: "vendor@demo.com",
  tagline: "Building the future of education",
  phoneNumber: "9999999999",
  websiteLink: "https://example.com",
  address: "Demo Address",
  pincode: "000000",
};


type HeaderProps = {
  name: string;
  email: string;
  tagline?: string;
};

type EntityTabsProps = {
  fields: string[];
  data: StatsMap;
};

const Colors = useColors();

/* ---------------- HEADER ---------------- */
function Header({ name, email, tagline }: HeaderProps) {
  return (
    <div className="flex justify-between p-4">
      <div>
        <span className={`text-5xl ${Colors.text.special}`}>Greetings,</span>{" "}
        <span className={`text-5xl ${Colors.text.primary}`}>{name}</span>
        <div className="mt-2 text-lg">
          <span className={`${Colors.text.primary}`}>
            {tagline || "Welcome back to your dashboard"}
          </span>
        </div>
      </div>

      <div className="flex mr-11 items-center gap-6">
        <div className="p-6 bg-white rounded-full flex justify-center items-center">
          <User size={32} color="black" />
        </div>

        <div className="flex flex-col">
          <h1 className={`${Colors.text.primary} text-2xl font-semibold`}>
            {name}
          </h1>
          <p className={`${Colors.text.secondary}`}>{email}</p>
          {tagline && (
            <span className="text-sm text-white/50 mt-1">{tagline}</span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- URL MAP ---------------- */
const URL_MAP: Record<string, string> = {
  admins: "/admin-dashboard/admins",
  institutions: "/admin-dashboard/institutions",
  batches: "/admin-dashboard/batches",
  vendors: "/admin-dashboard/vendors",
};

/* ---------------- HERO SECTION ---------------- */

export default function HeroSection() {
  const [tabs, setTabs] = useState<StatsMap>({});
  const [fields, setFields] = useState<string[]>([]);

  const vendor = useVendor((state) => state.info);
  const setVendor = useVendor((state) => state.setData);

  useEffect(() => {
    getAllStats(setTabs);
  }, []);

  useEffect(() => {
    setFields(Object.keys(tabs));
  }, [tabs]);

  // FORCE UI TO WORK
  useEffect(() => {
    if (!vendor) {
      setVendor(DUMMY_VENDOR);
    }
  }, [vendor, setVendor]);

  // TRY REAL API (fails silently for now)
  useEffect(() => {
    if (!vendor?.id || vendor.id === "demo-vendor-id") return;
    getVendorData(null,vendor.id);
  }, [vendor?.id]);

  if (!vendor) return null;

  return (
    <>
      <Header
        name={vendor.name}
        email={vendor.email}
        tagline={vendor.tagline}
      />

      <EntityTabs fields={fields} data={tabs} />
    </>
  );
}

/* ---------------- ENTITY TABS ---------------- */
import { School, Handshake, ShieldCheck } from "lucide-react";

const ENTITY_META: Record<
  string,
  {
    icon: any;
    label: string;
    tagline: string;
    accent: string;
  }
> = {
  institutions: {
    icon: School,
    label: "Institutions",
    tagline: "Education centers associated with us",
    accent: "from-blue-500/20 to-blue-500/5",
  },
  vendors: {
    icon: Handshake,
    label: "Vendors",
    tagline: "Industry trainers who got involved",
    accent: "from-emerald-500/20 to-emerald-500/5",
  },
  admins: {
    icon: ShieldCheck,
    label: "Admins",
    tagline: "People maintaining our platform",
    accent: "from-orange-500/20 to-orange-500/5",
  },
};

function EntityTabs({ fields, data }: EntityTabsProps) {
  if (!fields.length) {
    return <p className="text-white/60 text-center mt-6">Loading dashboard…</p>;
  }

  return (
    <div className="mx-20 mt-8 grid grid-cols-1 gap-3">
      {fields.map((field) => {
        const meta = ENTITY_META[field];
        const href = URL_MAP[field];
        if (!meta || !href) return null;

        const Icon = meta.icon;

        return (
          <Link
            key={field}
            href={href}
            className={`
                            group relative rounded-2xl p-6
              ${Colors.background.secondary} overflow-hidden
              hover:shadow-2xl hover:-translate-y-1
              transition-all duration-300
              `}
          >
            {/* Gradient depth layer */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${meta.accent} opacity-0 group-hover:opacity-100 transition`}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col gap-4">
              {/* Icon + Count */}
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${Colors.background.primary}`}>
                  <Icon className={`text-primaryBlue`} size={28} />
                </div>
                <span className={`text-3xl font-bold ${Colors.text.primary}`}>
                  {data[field] ?? 0}
                </span>
              </div>

              {/* Text */}
              <div>
                <h3 className={`text-lg font-semibold ${Colors.text.primary}`}>
                  {meta.label}
                </h3>
                <p
                  className={`text-sm mt-1 leading-snug ${Colors.text.secondary}`}
                >
                  {meta.tagline}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
