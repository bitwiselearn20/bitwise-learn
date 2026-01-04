import React from "react";
import TargetSegments from "./TargetSegment";
import V1HomeNav from "@/component/Home/V1/V1HomeNav";
import TestimonialsSection from "./TestimonialsSection";
import Footer from "@/component/general/Footer";
import OurTeam from "./OurTeam";

const AboutV1 = () => {
  return (
    <div>
      <V1HomeNav />
      <TargetSegments />
      <TestimonialsSection />
      <OurTeam />
      <Footer />
    </div>
  );
};

export default AboutV1;
