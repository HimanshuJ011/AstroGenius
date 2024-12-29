"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-scroll";
import AnimatedGradientText from "./ui/animated-gradient-text";
import { cn } from "@/lib/utils";
import Navbar from "./Navbar";
import { OrbitingCirclesPlanet } from "./CirclesPlanet";

const HeaderSection: React.FC = () => {
  return (
    <div className="relative isolate w-full overflow-hidden py-12 md:py-24 bg-gradient-to-b from-indigo-200 via-indigo-100 to-indigo-50">
      <Navbar />
      <OrbitingCirclesPlanet />
      <div className="relative mx-auto font-cabinet flex max-w-5xl flex-col items-center justify-center space-y-10 px-6 py-16 my-4 md:my-0 text-center radial-gradient(circle at top left, #FF8C00, transparent 50%)">
        {/* Title Section */}
        <div className="space-y-4">
          <AnimatedGradientText>
            <span
              className={cn(
                "inline bg-gradient-to-r from-[#FF8C00] via-[#8E44AD] to-[#FF8C00]",
                "animate-gradient bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent"
              )}
            >
              Introducing AstroScope
            </span>
          </AnimatedGradientText>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 lg:text-7xl">
            Discover Your Personalized{" "}
            <span className="bg-gradient-to-r from-purple-500 to-orange-500 bg-clip-text text-transparent">
              Astrological
            </span>{" "}
          </h1>

          <p className="text-4xl font-bold text-gray-900 lg:text-7xl">
            Insights for Just in 1{" "}
            <span className="group relative inline-block bg-gradient-to-b from-green-500 to-emerald-700 bg-clip-text text-transparent">
              Click
              <span className="absolute bottom-2 left-0 -z-10 h-3 w-full bg-[#FFD700]/20 transition-all duration-300 group-hover:h-full" />
              <span className="absolute -bottom-1 left-0 h-1 w-full bg-yellow-400 transition-all duration-300 hover:h-1.5" />
            </span>
          </p>

          {/* Description */}
          <p className="max-w-5xl text-lg font-medium leading-relaxed text-gray-700">
            <span className="italic">
              &quot;Astrology Meets AI—Your Cosmic Blueprint in Minutes&quot;
            </span>
          </p>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col items-center space-y-4">
          <Link to="birthForm" smooth={true}>
            <Button className="rounded-xl bg-indigo-500 px-8 py-6 text-base font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-indigo-700 hover:shadow-lg">
              Begin Your Journey
            </Button>
          </Link>
          <p className="text-sm text-slate-700 font-bold">
            No sign-up required • Instant delivery
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="hidden lg:grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {[
            { text: "Instant Results", icon: "⚡" },
            { text: "Private & Secure", icon: "🔒" },
            { text: "AI-Powered Analysis", icon: "✨" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex bg-indigo-100 rounded-full items-center justify-center space-x-2 text-slate-800 text-center font-bold py-1 px-2"
            >
              <span>{item.icon}</span>
              <span className="text-sm">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;
