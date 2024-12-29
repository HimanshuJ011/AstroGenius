import { NextResponse } from 'next/server';
const AstroCore = require("@/app/scripts/updateAstro-core"); 

interface AstroInput {
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  birthHour: number;
  birthMinute: number;
  birthZone: number;
  latitude: number;
  longitude: number;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    if (!isValidAstroInput(body)) {
      return NextResponse.json(
        { error: "Invalid input parameters" },
        { status: 400 }
      );
    }

    const input: AstroInput = {
      birthDay: parseInt(body.birthDay),
      birthMonth: parseInt(body.birthMonth),
      birthYear: parseInt(body.birthYear),
      birthHour: parseInt(body.birthHour),
      birthMinute: parseInt(body.birthMinute),
      birthZone: parseFloat(body.timezone), // Convert timezone string to number
      latitude: parseFloat(body.latitude),
      longitude: parseFloat(body.longitude),
    };

    const result = AstroCore.calculate(input);
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Horoscope calculation error:', error);
    return NextResponse.json(
      { error: "Failed to calculate horoscope" },
      { status: 500 }
    );
  }
}

function isValidAstroInput(body: any): boolean {
  return (
    body &&
    typeof body.birthDay !== 'undefined' &&
    typeof body.birthMonth !== 'undefined' &&
    typeof body.birthYear !== 'undefined' &&
    typeof body.birthHour !== 'undefined' &&
    typeof body.birthMinute !== 'undefined' &&
    typeof body.timezone !== 'undefined' &&
    typeof body.latitude !== 'undefined' &&
    typeof body.longitude !== 'undefined'
  );
}