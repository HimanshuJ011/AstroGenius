import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

  if (!geminiApiKey) {
    console.error("API key is missing");
    return NextResponse.json({ error: "API key is missing" }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(geminiApiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  try {
    const body = await req.json();
    const { input, context } = body;

    // Validate input more comprehensively
    if (!input || typeof input !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing input" },
        { status: 400 }
      );
    }

    const sanitizedInput = input
      .replace(/[^\w\s,.()-]/g, "") // Remove special characters
      .trim()
      .slice(0, 5000); // Limit input length

    console.log("SIP " + sanitizedInput);

    const newPrompt = `Based on the provided horoscopic details, craft a comprehensive and personalized horoscope report for an individual with the Zodiac Sign Gemini Using this data, create predictions for the following areas of life:

    Here is the Horoscope Data: """${sanitizedInput}""" and 

    ${
      context
        ? `Additional Context:
        Rashi: 
Zodiac Sign: ${context.zodiacSign}
Moon Angle: ${context.moonAngle}
Nakshatra: ${context.nakshatra}
Birth Dasha: ${context.birthDasha}
Birth Date: ${context.birthDate}
Birth Time: ${context.birthTime}
Day of Week: ${context.birthTime}
Current Dasha: ${context.currentDasha}
     `
        : ""
    }

Generate and Display Birth Details and give me all in rich format and then generate data on with same Title

 1. **Home & Family**
       - Provide insights into family harmony, domestic stability, and home-related matters.
    
    2. **Love & Relationships**
       - Offer predictions about romantic prospects, relationship dynamics, and emotional connections.
    
    3. **Career & Finances**
       - Highlight professional opportunities, career growth, and financial stability.
    
    4. **Purpose & Direction**
       - Give guidance on life purpose, decision-making, and personal growth.
    
    5. **Social & Emotional**
       - Reflect on social connections, emotional well-being, and interpersonal interactions.
    
    6. **Health & Wellness**
       - Predict health trends and provide well-being tips.
    

**Tips Section**
- For each area, include practical and actionable tips to help the user navigate challenges and make the most of opportunities. Ensure the tips are specific, empathetic, and valuable for their growth and well-being.

**Summary**
- Predict a Summary from birthDasha to CurrentDasha and on basis of CurrentDasha 



`;

    // Generate content
    const result = await model.generateContent(newPrompt);
    const responseText = result.response.text();

    // Validate response
    if (!responseText || responseText.trim() === "") {
      return NextResponse.json(
        { error: "No meaningful insights could be generated" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Insights successfully generated",
      data: responseText,
    });
  } catch (error) {
    console.error("Comprehensive Error in AI Insights Generation:", error);

    // Detailed error handling
    if (error instanceof Error) {
      switch (true) {
        case error.message.includes("SAFETY"):
          return NextResponse.json(
            { error: "Content generation blocked due to safety protocols" },
            { status: 403 }
          );
        case error.message.includes("quota"):
          return NextResponse.json(
            { error: "API quota exceeded. Please try again later." },
            { status: 429 }
          );
        default:
          return NextResponse.json(
            { error: "Unexpected error in generating insights" },
            { status: 500 }
          );
      }
    }

    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
