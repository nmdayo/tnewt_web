import { NextResponse } from "next/server";
import { Buffer } from "buffer";
import { supabase } from "@/lib/supabase";

const KOMOJU_API_KEY = process.env.KOMOJU_API_KEY;
const KOMOJU_MERCHANT_UUID = process.env.KOMOJU_MERCHANT_UUID;
const KOMOJU_ENDPOINT = process.env.KOMOJU_API_URL || "https://komoju.com/api/v1/sessions";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("支払いリクエストデータ:", data);

    if (!KOMOJU_API_KEY || !KOMOJU_MERCHANT_UUID) {
      throw new Error("環境変数が正しく設定されていません");
    }

    // 送信された日付データを直接使用
    const checkInDate = new Date(data.check_in_date).toISOString().split('T')[0];
    const checkOutDate = new Date(data.check_out_date).toISOString().split('T')[0];

    console.log("Supabaseに保存する日付:", { checkInDate, checkOutDate });

    // Supabaseに予約データを保存
    const { data: bookingData, error: supabaseError } = await supabase
      .from("bookings")
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        amount: data.amount,
        status: "pending",
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
      })
      .single();

    if (supabaseError) {
      console.error("Supabase詳細エラー:", {
        message: supabaseError.message,
        details: supabaseError.details,
        hint: supabaseError.hint,
        code: supabaseError.code
      });
      throw new Error(`Supabase保存エラー: ${supabaseError.message}`);
    }

    console.log("Supabase保存成功:", bookingData);

    const komojuData = {
      amount: data.amount,
      currency: "JPY",
      payment_types: ["credit_card"],
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/thank-you`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      locale: "ja",
      external_order_num: `ORDER-${Date.now()}`,
      merchant_uuid: KOMOJU_MERCHANT_UUID
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
    console.error("Payment initialization failed:", error);
    
    let errorMessage = "支払い処理の初期化に失敗しました。";
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        errorMessage = "支払い処理がタイムアウトしました。しばらく待ってから再度お試しください。";
      } else if (error.message.includes("KOMOJU API Error")) {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
