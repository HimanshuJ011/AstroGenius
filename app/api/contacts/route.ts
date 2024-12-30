import { NextResponse } from "next/server";
import { google, sheets_v4 } from "googleapis";
import { GoogleAuth, OAuth2Client } from "google-auth-library";
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;

async function authorize(): Promise<OAuth2Client> {
  const auth = new GoogleAuth({
    credentials: {
      client_email: process.env.CLIENT_EMAIL,
      private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
      project_id: process.env.PROJECT_ID,
    },
    scopes: SCOPES,
  });

  const authClient = await auth.getClient();
  if (!(authClient instanceof OAuth2Client)) {
    throw new Error("Failed to obtain OAuth2 client");
  }

  return authClient;
}

async function appendToGoogleSheet(data: any[]) {
  try {
    const authClient = await authorize();
    const sheets: sheets_v4.Sheets = google.sheets({
      version: "v4",
      auth: authClient,
    });

    const request = {
      spreadsheetId: GOOGLE_SHEET_ID,
      range: "Sheet1!A1", 
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      resource: {
        values: [data],
      },
    };

    await sheets.spreadsheets.values.append(request);
    console.log("Data appended successfully.");
  } catch (error) {
    console.error("Error appending data to Google Sheets:", error);
  }
}

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { message: "Name and email are required" },
        { status: 400 }
      );
    }

    const values = [name, email, new Date().toISOString()];

    await appendToGoogleSheet(values);

    return NextResponse.json(
      { message: "Thanks for contacting us!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Failed to process the request" },
      { status: 500 }
    );
  }
}
