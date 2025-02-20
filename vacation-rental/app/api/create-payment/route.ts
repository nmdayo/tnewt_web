import { NextResponse } from "next/server";
import { Buffer } from "buffer";
import { headers } from "next/headers";

const KOMOJU_API_KEY = process.env.KOMOJU_API_KEY;
const KOMOJU_MERCHANT_UUID = process.env.KOMOJU_MERCHANT_UUID;
const KOMOJU_ENDPOINT = process.env.KOMOJU_API_URL || "https://komoju.com/api/v1/sessions";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("Request Data:", data);

    if (!KOMOJU_API_KEY || !KOMOJU_MERCHANT_UUID) {
      throw new Error("環境変数 (KOMOJU_API_KEY, KOMOJU_MERCHANT_UUID) が正しく設定されていません");
    }

    const komojuData = {
      amount: data.amount,
      currency: data.currency,
      external_order_num: data.external_order_num,
      email: data.email,
      name: data.name,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      locale: "ja",
      default_payment_method: "credit_card",
      merchant_uuid: KOMOJU_MERCHANT_UUID,
    };

    console.log("Sending to KOMOJU:", komojuData);

    const response = await fetch(KOMOJU_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(KOMOJU_API_KEY + ":").toString("base64")}`,
      },
      body: JSON.stringify(komojuData),
      signal: AbortSignal.timeout(30000) // 30秒
    });

    const responseText = await response.text();
    console.log("KOMOJU Response Status:", response.status);
    console.log("KOMOJU Response Text:", responseText);

    if (!response.ok) {
      throw new Error(`KOMOJU API Error: ${responseText}`);
    }

    const paymentSession = JSON.parse(responseText);
    console.log("Payment Session Created:", paymentSession);

    // `session_url`を返却
    return NextResponse.json({ session_url: paymentSession.session_url });
  } catch (error: unknown) {
    console.error("Payment initialization error:", error);
    
    let errorMessage = "支払い処理の初期化に失敗しました。";
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = '支払い処理がタイムアウトしました。しばらく待ってから再度お試しください。';
      } else if (error.message.includes('KOMOJU API Error')) {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
