import { NextRequest, NextResponse } from "next/server";

const isProduction = process.env.NODE_ENV === "production";

const PAYPAL_API = isProduction
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

const clientId = isProduction
  ? process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID 
  : process.env.NEXT_PUBLIC_SANDBOX_CLIENT_ID; 

const clientSecret = isProduction
  ? process.env.PAYPAL_CLIENT_SECRET 
  : process.env.SANDBOX_SECRET_ID; 

type PayPalOrder = {
  status: string;
  purchase_units: Array<{
    amount: {
      value: string;
      currency_code: string;
    };
  }>;
};

async function getAccessToken(): Promise<string> {
  if (!clientId || !clientSecret) {
    console.error("Missing PayPal credentials");
    throw new Error("PayPal credentials not configured");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("PayPal token fetch error:", errorText);
    throw new Error(`PayPal auth failed: ${errorText}`);
  }

  const data = await response.json();
  console.log(data);
  
  return data.access_token;
}

export async function POST(request: NextRequest) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await request.json();

    if (!body.orderID) {
      return new NextResponse(
        JSON.stringify({ verified: false, message: "Order ID is required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const accessToken = await getAccessToken();

    const response = await fetch(
      `${PAYPAL_API}/v2/checkout/orders/${body.orderID}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`PayPal API error: ${response.status} - ${errorText}`);
      throw new Error(`PayPal API error: ${errorText}`);
    }

    const order = (await response.json()) as PayPalOrder;

    const expectedAmount = process.env.EXPECTED_PAYMENT_AMOUNT || "1.00";
    const expectedCurrency = process.env.EXPECTED_PAYMENT_CURRENCY || "USD";

    const isValidOrder =
      order.status === "COMPLETED" &&
      order.purchase_units?.[0]?.amount?.value === expectedAmount &&
      order.purchase_units?.[0]?.amount?.currency_code === expectedCurrency;

    if (!isValidOrder) {
      return new NextResponse(
        JSON.stringify({
          verified: false,
          message: "Payment validation failed: Invalid order details",
          details: {
            status: order.status,
            amount: order.purchase_units?.[0]?.amount?.value,
            currency: order.purchase_units?.[0]?.amount?.currency_code,
          },
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    return new NextResponse(
      JSON.stringify({ verified: true, orderID: body.orderID }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("PayPal verification error:", error);
    return new NextResponse(
      JSON.stringify({
        verified: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}
