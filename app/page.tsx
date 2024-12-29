import React from "react";
import HeaderSection from "@/components/HeaderSection";
import BenefitSection from "@/components/BenifitSection";
import HowItWorksSection from "@/components/HowItWorks";
import Form from "@/components/Form";
import FeatureSection from "@/components/Features";
import Footer from "@/components/Footer";

const HoroscopeGenerator: React.FC = () => {
  return (
    <div className="min-h-screen">
      <HeaderSection />
      <BenefitSection />
      <HowItWorksSection />
      <Form />
      <FeatureSection />
      <Footer />
    </div>
  );
};

export default HoroscopeGenerator;
