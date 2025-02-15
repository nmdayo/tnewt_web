import { google } from "googleapis";
import { NextResponse } from "next/server";
console.log("🔍 環境変数（部分表示）:", process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.substring(0, 50));

const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;
let SERVICE_ACCOUNT_KEY = null;
try {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    SERVICE_ACCOUNT_KEY = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY.replace(/\\n/g, "\n"));
  }
} catch (error) {
  console.error("❌JSON パースエラー:", error);
}


async function getAuthenticatedClient() {
  if (!SERVICE_ACCOUNT_KEY) {
    throw new Error("❌Google service account key is missing");
  }

  console.log("🔍使用する Google サービスアカウント:", SERVICE_ACCOUNT_KEY.client_email);

  const auth = new google.auth.JWT(
    SERVICE_ACCOUNT_KEY.client_email,
    undefined,
    SERVICE_ACCOUNT_KEY.private_key,
    SCOPES
  );
  

  return auth;
}

export async function POST(req: Request) {
  try {
    const { checkIn, checkOut } = await req.json();

    console.log("📅 予約リクエスト受信:", { checkIn, checkOut });
    console.log("🔍 KOMOJU_API_KEY:", process.env.KOMOJU_API_KEY ? "✔️ 設定済み" : "❌ 未設定");
    console.log("🔍 KOMOJU_MERCHANT_UUID:", process.env.KOMOJU_MERCHANT_UUID ? "✔️ 設定済み" : "❌ 未設定");
    console.log("🔍 KOMOJU_API_URL:", process.env.KOMOJU_API_URL);
    console.log("🔍 NEXT_PUBLIC_BASE_URL:", process.env.NEXT_PUBLIC_BASE_URL);
    console.log("🔍 GOOGLE_CALENDAR_ID:", CALENDAR_ID);
    console.log("🔍 GOOGLE_SERVICE_ACCOUNT_KEY:", SERVICE_ACCOUNT_KEY ? "✔️ 設定済み" : "❌ 未設定");

    if (!CALENDAR_ID) {
      throw new Error("❌ Google Calendar ID が設定されていません");
    }

    const authClient = await getAuthenticatedClient();

    const calendar = google.calendar({ version: "v3", auth: authClient });

    const event = {
      summary: "✕",
      start: { date: checkIn, timeZone: "Asia/Tokyo" },
      end: { date: checkOut, timeZone: "Asia/Tokyo" },
    };

    const response = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      requestBody: event,
    });

    console.log("✅ Google カレンダーに予約が追加されました:", response.data);

    return NextResponse.json({ message: "Booking successful" });
  } catch (error) {
    console.error("❌ Error creating booking:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
