"use client";

import { desc } from "framer-motion/client";
import ProfileCard from "./ProfileCard";
import Picture_Angadveer from "@/app/images/Picture_Angadveer.jpeg";
import Picture_Angad from "@/app/images/Picture_Angad.jpg";
import Picture_Adheesh from "@/app/images/Picture_Adheesh.jpg";
import Picture_Aadarsh from "@/app/images/Picture_Aadarsh.jpg";
import Picture_Aayush from "@/app/images/Picture_Aayush.jpg";

const contributors = [
  {
    name: "Aadarsh Verma",
    role: "Frontend Dev",
    Picture: Picture_Aadarsh,
    description:
      "Passionate frontend developer with expertise in React and modern web technologies. Creating beautiful, responsive interfaces with attention to detail and user experience.",
    linkedinUrl: "https://www.linkedin.com/in/aadarsh-verma-59323134a",
    github_id: "AadarshVerma7",
  },
  {
    name: "Angad Sudan",
    role: "UI Designer",
    Picture: Picture_Angad,
    description:
      "Passionate frontend developer with expertise in React and modern web technologies. Creating beautiful, responsive interfaces with attention to detail and user experience.",
    linkedinUrl: "https://www.linkedin.com/in/angadsudan",
    github_id: "AngadSudan",
  },
  {
    name: "Angadveer Singh",
    role: "Backend Dev",
    Picture: Picture_Angadveer,
    description:
      "Passionate frontend developer with expertise in React and modern web technologies. Creating beautiful, responsive interfaces with attention to detail and user experience.",
    linkedinUrl: "https://www.linkedin.com/in/angadveer-singh-1751842b2",
    github_id: "Angadveer185",
  },
  {
    name: "Adheesh Verma",
    role: "Product Manager",
    Picture: Picture_Adheesh,
    description:
      "Passionate frontend developer with expertise in React and modern web technologies. Creating beautiful, responsive interfaces with attention to detail and user experience.",
    linkedinUrl: "https://www.linkedin.com/in/adheesh-verma-177538324/",
    github_id: "AdheeshVerma",  
  },
  {
    name: "Aayush Vats",
    role: "Fullstack Dev",
    Picture: Picture_Aayush,
    description:
      "Passionate frontend developer with expertise in React and modern web technologies. Creating beautiful, responsive interfaces with attention to detail and user experience.",
    linkedinUrl: "https://www.linkedin.com/in/theaayushvats/",
    github_id: "Aayush-0821",
  },
];

export default function ContributorsV1() {
  return (
    <div className="w-full overflow-hidden py-20 bg-black">
  <h2 className="text-white text-4xl font-bold text-center mb-12">
    Contributors
  </h2>

  <div className="relative">
    <div className="animate-scroll flex gap-10 px-10">
      {[...contributors, ...contributors].map((c, index) => (
        <ProfileCard
          key={index}
          name={c.name}
          role={c.role}
          profilePicture={c.Picture}
          description={c.description}
          linkedinUrl={c.linkedinUrl}
          github_id={c.github_id}
        />
      ))}
    </div>
  </div>
</div>

  );
}
