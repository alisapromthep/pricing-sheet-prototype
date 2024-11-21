"use server";

import { google } from "googleapis";

export async function getGoogleSheetData() {
  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  const ranges = [
    "lens!A2:Z",
    "lensTreatment!A1:Z",
    "addOn!A1:Z",
    "packages!A2:Z",
    "superflexAddon!A1:Z",
    "mcssAddon!A1:Z",
  ];

  const response = await sheets.spreadsheets.values.batchGet({
    spreadsheetId: process.env.SHEET_ID!,
    ranges,
  });
  console.log("response in getGoogleData", response);

  // Map the data into an object for better structure
  const result: Record<string, any[][]> = {};
  response.data.valueRanges?.forEach((valueRange, index) => {
    const sheetName = ranges[index].split("!")[0]; // Extract sheet name from range
    result[sheetName] = valueRange.values || []; // Store values or an empty array if no data
  });

  return result;
}
