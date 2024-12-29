import React from "react";
import { Fingerprint, Bot, ScrollText, Shield, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BenefitItem {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

// interface BenefitCardProps extends BenefitItem {}

const BenefitCard: React.FC<BenefitItem> = ({
  icon: Icon,
  title,
  description,
  gradient,
}) => (
  <div className="group relative overflow-hidden rounded-2xl bg-white/50 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
    <div className="relative z-10 flex items-start space-x-4">
      <div className={cn(
        "rounded-xl p-3 bg-gradient-to-r",
        gradient,
        "text-white transform transition-transform duration-300 group-hover:scale-110"
      )}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
    <div className={cn(
      "absolute inset-0 opacity-0 bg-gradient-to-r",
      gradient,
      "transition-opacity duration-300 group-hover:opacity-5"
    )} />
  </div>
);

const BENEFITS: BenefitItem[] = [
  {
    icon: Fingerprint,
    title: "Personalized Analysis",
    description:
      "Deep insights based on your unique birth chart and planetary positions.",
    gradient: "from-purple-700 to-purple-500",
  },
  {
    icon: ScrollText,
    title: "Comprehensive Report",
    description:
      "Detailed analysis of relationships, career path, and personalized remedies.",
    gradient: "from-sky-700 to-sky-500",
  },
  {
    icon: Shield,
    title: "Vedic Remedies",
    description:
      "Ancient wisdom combined with modern solutions for life's challenges.",
    gradient: "from-emerald-700 to-emerald-500",
  },
  {
    icon: Bot,
    title: "AI-Powered Accuracy",
    description:
      "Advanced algorithms for precise astrological calculations and interpretations.",
    gradient: "from-orange-700 to-orange-500",
  },
];

const BenefitsSection = () => {
  return (
    <div className="relative isolate w-full overflow-hidden bg-gradient-to-b from-indigo-50 to-white pb-12 md:pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center space-y-4 my-8">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900">
            Why Choose Our{" "}
            <span className={cn(
              "inline bg-gradient-to-r from-indigo-700 via-purple-600 to-indigo-400",
              "animate-gradient bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent"
            )}>
              Cosmic Analysis
            </span>
          </h2>
          <p className="text-lg font-medium text-gray-600">
            Get comprehensive insights powered by ancient wisdom and modern technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BENEFITS.map((benefit, index) => (
            <BenefitCard key={index} {...benefit} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;