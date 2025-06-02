import { NextResponse } from "next/server";
import { getGoogleSheetData } from "@/services/getGoogleData";

export async function GET() {
  try {
    const data = await getGoogleSheetData();
    return NextResponse.json(data);
  } catch (error) {
    // Log the error for server-side debugging
    // This 'error' variable is now being used.
    console.error("Error fetching Google Sheets data:", error);

    return NextResponse.json(
      { message: "Failed to fetch Google Sheets Data" },
      { status: 500 }
    );
  }
}
