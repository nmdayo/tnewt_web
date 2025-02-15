import { google } from "googleapis";
import { NextResponse } from "next/server";

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID!;
const SERVICE_ACCOUNT_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY.replace(/\\n/g, "\n"))
  : null;

async function getAuthenticatedClient() {
  if (!SERVICE_ACCOUNT_KEY) {
    throw new Error("Google service account key is missing");
  }

  // 🚀 `google.auth.JWT` を使用
  const auth = new google.auth.JWT({
    email: SERVICE_ACCOUNT_KEY.client_email,
    key: SERVICE_ACCOUNT_KEY.private_key,
    scopes: SCOPES,
  });

  return auth;
}

export async function GET() {
  try {
    const authClient = await getAuthenticatedClient();

    // 🚀 `authClient` の型を `JWT` に統一
    const calendar = google.calendar({ version: "v3", auth: authClient });

    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);

    const events = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: today.toISOString(),
      timeMax: nextYear.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    const bookedDates = events.data.items
      ?.filter(event => event.summary?.includes("✕"))
      .map(event => new Date(event.start?.date || event.start?.dateTime || "").toISOString());

    return NextResponse.json({ bookedDates });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
