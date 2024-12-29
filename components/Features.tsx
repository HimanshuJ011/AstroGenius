"use client";
import React, { useEffect } from "react";

import { Home, Heart, Briefcase, Anchor, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-scroll";

const FeatureSection = () => {
  const lifeProblems = [
    {
      icon: Home,
      title: "Home & Family",
      description: "Understand your domestic life and family dynamics",
      color: "from-rose-500 to-orange-500",
    },
    {
      icon: Heart,
      title: "Love & Relationships",
      description: "Discover your path to meaningful connections",
      color: "from-purple-500 to-blue-500",
    },
    {
      icon: Briefcase,
      title: "Career & Finances",
      description: "Navigate your professional journey with confidence",
      color: "from-blue-500 to-emerald-500",
    },
    {
      icon: Anchor,
      title: "Purpose & Direction",
      description: "Find clarity in your life&#39;s greater purpose",
      color: "from-orange-500 to-purple-500",
    },
    {
      icon: Users,
      title: "Social & Emotional",
      description: "Enhance your relationships and emotional intelligence",
      color: "from-purple-500 to-emerald-500",
    },
    {
      icon: Zap,
      title: "Health & Wellness",
      description: "Optimize your physical and mental wellbeing",
      color: "from-blue-500 to-orange-500",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-tr from-indigo-100 via-white to-purple-50 py-24">
      <div className="relative mx-auto px-4">
        <div className="flex flex-col items-center space-y-12">
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 md:text-3xl">
                What You&#39;ll Discover
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {lifeProblems.map((problem, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-xl bg-white p-4 shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "shrink-0 rounded-xl bg-gradient-to-r p-3",
                          problem.color
                        )}
                      >
                        <problem.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-gray-900">
                          {problem.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {problem.description}
                        </p>
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                ))}
              </div>
            </div>

            <Link to="birthForm">
              <Button className="w-full rounded-xl my-4 bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6 text-lg font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                Get Your Personalized Report
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
