"use client";
import React, { useState, ChangeEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock, Sparkles, Download } from "lucide-react";
import { cn, formatContent } from "@/lib/utils";
import jsPDF from "jspdf";
import Particles from "@/components/ui/particles";
import {
  FormData,
  HoroscopeData,
  LocationResult,
  SelectedLocation,
} from "@/lib/FormTypes";

const Form = () => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    birthDate: "",
    birthTime: "",
    location: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const divRef = useRef<HTMLDivElement | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [calculating, setCalculating] = useState<boolean>(false);
  const [horoscopeResult, setHoroscopeResult] = useState<
    Partial<HoroscopeData>
  >({});
  const [showResults, setShowResults] = useState<boolean>(false);
  const [aiInsights, setAIInsights] = useState<string>("");
  const [paid, setPaid] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    if (name === "location") {
      handleSearchChange(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const searchLocations = async (query: string): Promise<void> => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const API_KEY = process.env.NEXT_PUBLIC_GEOCODE_API_KEY || "";
      const response = await fetch(
        `https://geocode.maps.co/search?q=${encodeURIComponent(
          query
        )}&api_key=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch location data");
      }
      const data: LocationResult[] = await response.json();
      setSearchResults(data);
    } catch (err) {
      setError("Error fetching locations. Please try again.");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string): void => {
    setSearchQuery(value);
    setError(null);

    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout);
    }

    window.searchTimeout = setTimeout(() => {
      searchLocations(value);
    }, 500);
  };

  const handleLocationSelect = (location: LocationResult): void => {
    setSelectedLocation({
      city: location.display_name.split(",")[0],
      fullAddress: location.display_name,
      latitude: parseFloat(location.lat),
      longitude: parseFloat(location.lon),
      timezone: getTimezoneEstimate(
        parseFloat(location.lat),
        parseFloat(location.lon)
      ),
    });
    setSearchResults([]);
    setSearchQuery(location.display_name);
    setFormData((prev) => ({
      ...prev,
      location: location.display_name,
    }));
  };

  const getTimezoneEstimate = (lat: number, lon: number): string => {
    const hours = Math.round(lon / 15);
    const sign = hours >= 0 ? "+" : "";
    return `UTC${sign}${hours}:00`;
  };

  const isFormValid =
    formData.name &&
    formData.email &&
    formData.birthDate &&
    formData.birthTime &&
    searchQuery;
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.birthDate) {
      newErrors.birthDate = "Birth date is required";
      isValid = false;
    }

    if (!formData.birthTime) {
      newErrors.birthTime = "Birth time is required";
      isValid = false;
    }

    if (!formData.location) {
      newErrors.location = "Please select a valid location";
      isValid = false;
    }

    if (formData.birthDate) {
      const [year, month, day] = formData.birthDate.split("-").map(Number);
      const currentDate = new Date();
      const selectedDate = new Date(year, month - 1, day);

      if (selectedDate > currentDate) {
        newErrors.birthDate = "Birth date cannot be in the future";
        isValid = false;
      }
    }

    if (formData.birthTime) {
      const [hour, minute] = formData.birthTime.split(":").map(Number);
      if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
        newErrors.birthTime = "Invalid time format";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const calculateHoroscope = async () => {
    setCalculating(true);
    setError(null);

    try {
      if (!selectedLocation) {
        throw new Error("Location must be selected.");
      }

      // Extract and transform the input
      const [year, month, day] = formData.birthDate.split("-").map(Number);
      const [hour, minute] = formData.birthTime.split(":").map(Number);
      const timezone = parseFloat(
        selectedLocation.timezone.replace("UTC", "").split(":")[0]
      );

      const payload = {
        birthDay: day,
        birthMonth: month,
        birthYear: year,
        birthHour: hour,
        birthMinute: minute,
        timezone, // Already parsed as a float
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      };
      // console.log("Request Payload:", payload); // Debugging: Verify transformed payload

      const response = await fetch("/api/calculate-horoscope", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to calculate horoscope");
      }

      const horoscopeData = result.data;
      setHoroscopeResult(horoscopeData);
      // console.log(horoscopeData);

      setShowResults(true);

      await fetchAIInsights(horoscopeData);
    } catch (err) {
      console.error("API Error:", err); // Log the error
      setError(
        err instanceof Error ? err.message : "Failed to calculate horoscope"
      );
    } finally {
      setCalculating(false);
    }
  };

  const fetchAIInsights = async (horoscopeResult: HoroscopeData) => {
    setLoading(true);

    try {
      const inputToSend =
        typeof horoscopeResult === "string"
          ? horoscopeResult
          : JSON.stringify(horoscopeResult);

      const response = await fetch(`${window.location.origin}/api/genai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: inputToSend,
          context: {
            rashi: horoscopeResult.rashi,
            moonAngle: horoscopeResult.moonAngle,
            birthTime: horoscopeResult.birthTime,
            dayOfWeek: horoscopeResult.dayOfWeek,
            birthTimeZone: horoscopeResult.birthTimeZone,
            nakshatra: horoscopeResult.nakshatra,
            zodiacSign: horoscopeResult.zodiacSign,
            birthDate: horoscopeResult.birthDate,
            birthDasha: horoscopeResult.birthDasha,
            currentDasha: horoscopeResult.currentDasha,
          },
        }),
      });

      const text = await response.text(); // Handle non-JSON responses
      if (!response.ok) {
        throw new Error(`Error: ${text}`);
      }

      const result = JSON.parse(text); // Parse the valid JSON response
      if (result.data) {
        const output = formatContent(result.data);
        // console.log(output);
        setAIInsights(output);
        setPaid(true);
        setStep(2);
      } else {
        throw new Error("No insights generated");
      }
    } catch (err) {
      console.error("Error fetching AI insights:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await calculateHoroscope();
        await fetch("/api/contacts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
          }),
        });
        setStep(2);
      } catch (error) {
        console.error("Error saving contact:", error);
      }
    }
  };

  const handleBack = (): void => {
    setStep((prev) => Math.max(1, prev - 1));
    setError(null);
  };

  const LocationSearchResults = () => {
    if (loading) {
      return <div className="mt-2 text-gray-600">Searching locations...</div>;
    }

    if (error) {
      return <div className="mt-2 text-red-500">{error}</div>;
    }

    if (searchResults.length > 0) {
      return (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          {searchResults.map((location, index) => (
            <button
              key={index}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              onClick={() => handleLocationSelect(location)}
            >
              {location.display_name}
            </button>
          ))}
        </div>
      );
    }

    return null;
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    doc.setProperties({
      title: "Personalized Cosmic Insights Report",
      subject: "Comprehensive Astrological Analysis",
      author: "Cosmic Journey",
      creator: "Cosmic Insights Platform",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let currentY = margin;

    // Set up fonts and colors
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0); // Black text

    // Function to add a new page if needed
    const checkPageBreak = (requiredSpace: number) => {
      if (currentY + requiredSpace > pageHeight - margin) {
        doc.addPage();
        currentY = margin;
      }
    };

    // Function to add a section title and content
    const addSection = (title: string | string[], content: string) => {
      checkPageBreak(30);

      // Section Title
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(title, margin, currentY);
      currentY += 10;

      // Section Content
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");

      // Split text for multi-page support
      const splitText = doc.splitTextToSize(content, pageWidth - margin * 2);

      // Add text with auto-pagination
      doc.text(splitText, margin, currentY, {
        maxWidth: pageWidth - margin * 2,
        lineHeightFactor: 1.5,
      });

      // Update current Y position after adding text
      currentY += splitText.length * 7; // Approximate line height
      currentY += 15; // Additional spacing between sections
    };

    // Title styling
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Personalized Cosmic Insights", pageWidth / 2, currentY, {
      align: "center",
    });
    currentY += 15;

    // Personal Details Section
    doc.setFontSize(12);

    const personalDetails = [
      `Birth Details`,
      `  `,
      `Name: ${formData.name}`,
      `Rashi: ${horoscopeResult.rashi}`,
      `Zodiac Sign: ${horoscopeResult.zodiacSign}`,
      `Moon Angle: ${horoscopeResult.moonAngle}`,
      `Nakshatra: ${horoscopeResult.nakshatra}`,
      `Birth Dasha: ${horoscopeResult.birthDasha}`,
      `Birth Date: ${horoscopeResult.birthDate}`,
      `Birth Time: ${formData.birthTime}`,
      `Day of Week: ${horoscopeResult.dayOfWeek}`,
    ];

    personalDetails.forEach((detail) => {
      checkPageBreak(10);
      doc.text(detail, margin, currentY);
      currentY += 7;
    });

    currentY += 5;

    // Draw a line separator
    doc.setLineWidth(0.5);
    doc.line(margin, currentY, pageWidth - margin, currentY);

    currentY += 10;

    // Sections of the report
    const sections = [
      { title: "Home & Family", contentKey: "Home & Family" },
      { title: "Love & Relationships", contentKey: "Love & Relationships" },
      { title: "Career & Finances", contentKey: "Career & Finances" },
      { title: "Purpose & Direction", contentKey: "Purpose & Direction" },
      { title: "Social & Emotional", contentKey: "Social & Emotional" },
      { title: "Health & Wellness", contentKey: "Health & Wellness" },
      { title: "Summary", contentKey: "Summary" },
    ];

    sections.forEach((section) => {
      const content = aiInsights.includes(section.contentKey)
        ? aiInsights
            .split(section.contentKey)[1]
            .split(
              sections[sections.indexOf(section) + 1]?.contentKey || "Summary"
            )[0]
            .trim()
        : "No information available for this section.";

      addSection(section.title, content);
    });

    // Add page numbers and footer
    const pageCount = doc.internal.pages.length;

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);

      // Page number at the bottom right corner
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth - margin,
        pageHeight - margin / 2,
        { align: "right" }
      );
    }
    const socialLinks = [
      { name: "Twitter", url: "https://twitter.com/himanshuj144" },
      { name: "Linkedin", url: "https://www.linkedin.com/in/himanshujoshi011" },
    ];

    checkPageBreak(20);
    currentY = pageHeight - margin;

    socialLinks.forEach((link) => {
      doc.setFontSize(10);
      doc.text(`${link.name}: ${link.url}`, margin, currentY);
      currentY += 5;
    });

    const fileName = `cosmic_insights_${formData.name.replace(
      /\s+/g,
      "_"
    )}.pdf`;

    try {
      doc.save(fileName);
    } catch (error) {
      console.error("Error saving PDF:", error);
    }
  };

  const inputClasses =
    "w-full px-4 py-3 bg-white/80 text-gray-800 rounded-xl border border-gray-400 focus:border-[#8E44AD] focus:ring-2 focus:ring-[#8E44AD]/20 outline-none transition-all duration-200";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-2";
  const errorClasses = "text-red-500 text-sm mt-1";

  const renderOutput = () => {
    return (
      <div className="bg-white shadow-xl rounded-lg">
        {paid ? (
          <div>
            {aiInsights && (
              <div className="space-y-4  ">
                <h2 className="font-bold pt-2 text-center">
                  Your Astro Report is here 👇🏻
                </h2>
                <div className="relative overflow-hidden border rounded-lg p-4">
                  <div
                    className="overflow-y-auto max-h-80 whitespace-pre-wrap"
                    ref={divRef}
                  >
                    {aiInsights}
                  </div>
                </div>

                <Button
                  type="submit"
                  className={cn(
                    "w-full rounded-lg px-8 py-6 text-lg font-semibold text-white transition-all duration-300 group",
                    "bg-gradient-to-r from-purple-600 to-blue-500"
                  )}
                  disabled={!paid}
                  onClick={handleDownloadPdf}
                >
                  Download
                  <Download className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 text-center">
                Live Preview
              </h3>

              <div className="border rounded-lg">
                <div className="p-4 bg-white/80 rounded-lg shadow-sm">
                  <h4 className="font-medium text-gray-700">
                    Personal Details
                  </h4>
                  <div className="mt-2 space-y-2">
                    <p className="text-gray-600">
                      Name: {formData?.name || "Not provided"}
                    </p>
                    <p className="text-gray-600">
                      Birth Date: {formData?.birthDate || "Not provided"}
                    </p>
                    <p className="text-gray-600">
                      Birth Time: {formData?.birthTime || "Not provided"}
                    </p>
                    <p className="text-gray-600">
                      Location: {formData?.location || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Conditional Loader */}
            {calculating && step === 2 ? (
              <div className="flex items-center justify-center mt-6 space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-600"></div>
                <p className="text-gray-600">Generating...</p>
              </div>
            ) : (
              <div className="mt-6">
                {loading ? (
                  <p className="text-gray-600 text-center">
                    Loading AI insights...
                  </p>
                ) : (
                  aiInsights && (
                    <div className="space-y-4 text-center">
                      <h2 className="font-bold">Your AI Report is here 👇🏻</h2>
                      <div className="relative overflow-hidden border rounded-lg p-4">
                        <p>{aiInsights.slice(0, 300)}...</p>
                        <div className="absolute bottom-0 left-0 w-full h-28 bg-gradient-to-t from-white to-transparent backdrop-blur-sm shadow-xl pointer-events-none"></div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
  return (
    <div id="birthForm" className="relative isolate w-full bg-indigo-950 py-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            {step === 1 && (
              <form
                onSubmit={handleSubmit}
                className="space-y-8 rounded-2xl bg-white/95 p-8 backdrop-blur-sm shadow-xl"
              >
                <div className="text-center space-y-4">
                  <h3 className="text-3xl font-bold tracking-tight text-gray-900">
                    Begin Your{" "}
                    <span
                      className={cn(
                        "inline bg-gradient-to-r from-[#FF8C00] via-[#8E44AD] to-[#FF8C00]",
                        "animate-gradient bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent"
                      )}
                    >
                      Cosmic Journey
                    </span>
                  </h3>
                  <p className="text-gray-600">
                    Enter your details to receive personalized insights
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className={labelClasses}>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={cn(
                        inputClasses,
                        errors.name && "border-red-500"
                      )}
                      placeholder="e.g. John"
                      maxLength={50}
                    />
                    {errors.name && (
                      <p className={errorClasses}>{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelClasses}>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={cn(
                        inputClasses,
                        errors.email && "border-red-500"
                      )}
                      placeholder="e.g. john@mail.com"
                      maxLength={50}
                    />
                    {errors.name && (
                      <p className={errorClasses}>{errors.name}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClasses}>Birth Date</label>
                      <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        className={cn(
                          inputClasses,
                          errors.birthDate && "border-red-500"
                        )}
                        max={new Date().toISOString().split("T")[0]}
                      />
                      {errors.birthDate && (
                        <p className={errorClasses}>{errors.birthDate}</p>
                      )}
                    </div>
                    <div>
                      <label className={labelClasses}>Birth Time</label>
                      <input
                        type="time"
                        name="birthTime"
                        value={formData.birthTime}
                        onChange={handleInputChange}
                        className={cn(
                          inputClasses,
                          errors.birthTime && "border-red-500"
                        )}
                      />
                      {errors.birthTime && (
                        <p className={errorClasses}>{errors.birthTime}</p>
                      )}
                    </div>
                  </div>

                  <div className="relative">
                    <label className={labelClasses}>Birth Location</label>
                    <input
                      type="text"
                      name="location"
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className={cn(
                        inputClasses,
                        errors.location && "border-red-500"
                      )}
                      placeholder="City, Country"
                      maxLength={100}
                    />
                    {errors.location && (
                      <p className={errorClasses}>{errors.location}</p>
                    )}
                    <LocationSearchResults />
                  </div>
                </div>

                <Button
                  type="submit"
                  className={cn(
                    "w-full rounded-xl px-8 py-6 text-lg font-semibold text-white transition-all duration-300 group",
                    "bg-gradient-to-r from-gray-400 to-gray-500",
                    "hover:scale-105 hover:shadow-lg hover:from-purple-600 hover:to-blue-500",
                    !isFormValid
                      ? "opacity-50 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#8E44AD] to-[#58ACE0]"
                  )}
                  disabled={!isFormValid || calculating}
                >
                  {calculating ? (
                    <>
                      Generating...
                      <span className="ml-2 animate-spin w-5 h-5 border-t-2 border-white border-b-2 rounded-full"></span>
                    </>
                  ) : (
                    <>
                      Continue to Generating
                      <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </form>
            )}
            {step === 2 && (
              <div className="space-y-8  rounded-2xl bg-white p-8 backdrop-blur-sm shadow-xl text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-[#8E44AD] to-[#FFD700] p-3 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>

                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Your{" "}
                    <span
                      className={cn(
                        "inline bg-gradient-to-r from-[#FF8C00] via-[#8E44AD] to-[#FF8C00]",
                        "animate-gradient bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent"
                      )}
                    >
                      Cosmic Blueprint
                    </span>{" "}
                    is Ready!
                  </h2>
                  <p className="text-gray-600">
                    Download your comprehensive analysis and begin your journey
                    to success
                  </p>
                </div>

                <div className="space-y-4">
                  <h3>Thanks For Visiting </h3>

                  <Button
                    onClick={handleBack}
                    variant="ghost"
                    className="w-full border"
                  >
                    Back
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className="w-full">{renderOutput()}</div>
        </div>
      </div>
      <Particles
        className="absolute inset-0"
        quantity={100}
        ease={80}
        color={"#ffffff"}
        refresh
      />
    </div>
  );
};

export default Form;
