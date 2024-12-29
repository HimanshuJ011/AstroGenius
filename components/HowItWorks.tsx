import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ArrowRight, Star, Compass, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const JourneySection = () => {
  const STEPS = [
    {
      title: "Begin Your Journey",
      description:
        "Start your astrological exploration with a personalized birth chart analysis.",
      icon: Star,
      features: [
        "Personal birth chart",
        "Detailed analysis",
        "Cosmic insights",
      ],
      gradient: { background: "from-blue-500 to-indigo-600" },
    },
    {
      title: "Discover Insights",
      description:
        "Explore your unique planetary alignments and celestial influences.",
      icon: Compass,
      features: ["Planetary positions", "Element analysis", "House placements"],
      gradient: { background: "from-purple-500 to-pink-600" },
    },
    {
      title: "Transform Within",
      description:
        "Embrace your cosmic destiny and unlock your true potential.",
      icon: Sparkles,
      features: [
        "Personal guidance",
        "Life path insights",
        "Future predictions",
      ],
      gradient: { background: "from-pink-500 to-rose-600" },
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white px-4 py-24">
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:36px_36px]" />
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 md:px-8 animate">
        {/* Header Section */}
        <div className="mb-20 text-center font-cabinet">
          <h2 className="mb-6  text-4xl font-extrabold md:text-5xl lg:text-6xl">
            3 Simple{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-4xl font-extrabold text-transparent md:text-5xl lg:text-6xl">
              Steps
            </span>
          </h2>

          <p className="mx-auto max-w-2xl text-lg text-gray-600 md:text-xl">
            to Unlock your astrological insights in three transformative steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative grid gap-8 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <div key={index} className="relative">
              <Card className=" group relative h-full overflow-hidden rounded-2xl border-0 bg-white/90 shadow-lg transition-all duration-500 hover:scale-105 hover:bg-white hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <CardContent className="relative p-8 ">
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div
                        className={cn(
                          "rounded-2xl bg-gradient-to-r p-3 ",
                          step.gradient.background
                        )}
                      >
                        <step.icon
                          className="h-6 w-6 text-white "
                          strokeWidth={1.5}
                        />
                      </div>
                      <span className="bg-gradient-to-r from-gray-400 to-gray-500 bg-clip-text text-5xl font-bold text-transparent">
                        {(index + 1).toString().padStart(2, "0")}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-gray-800">
                        {step.title}
                      </h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3">
                      {step.features.map((feature, fIndex) => (
                        <li
                          key={fIndex}
                          className="flex items-center space-x-3"
                        >
                          <div
                            className={cn(
                              "flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r",
                              step.gradient.background
                            )}
                          >
                            <Check className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Connector */}
              {index < STEPS.length - 1 && (
                <div className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 md:block">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg">
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JourneySection;
