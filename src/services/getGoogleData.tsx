"use server";

import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

// On serverless hosts (e.g. Vercel) there is no local secrets.json file to
// point GOOGLE_APPLICATION_CREDENTIALS at, so we also support passing the
// service account key JSON directly via GOOGLE_SERVICE_ACCOUNT_KEY. Falls
// back to the file-path-based Application Default Credentials (used by
// local dev via GOOGLE_APPLICATION_CREDENTIALS=./secrets.json) when unset.
function getAuthClient() {
  const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  // With no `credentials`/`keyFile`, GoogleAuth falls back to standard
  // Application Default Credentials resolution (e.g. the
  // GOOGLE_APPLICATION_CREDENTIALS file path), matching prior behavior.
  const auth = new google.auth.GoogleAuth({
    ...(serviceAccountKey && { credentials: JSON.parse(serviceAccountKey) }),
    scopes: SCOPES,
  });
  return auth.getClient();
}

export async function getGoogleSheetData(): Promise<Record<string, any[][]>> {
  const auth = await getAuthClient();
  // googleapis' auth union type is broader than what Sheets' `auth` option
  // declares; both credential strategies above produce a client it accepts
  // at runtime.
  const sheets = google.sheets({ version: "v4", auth: auth as any });

  const ranges = [
    "lens!A2:Z",
    "lensTreatment!A1:Z",
    "addOn!A1:Z",
    "packages!A2:Z",
    "superflexAddon!A1:Z",
    "mcssAddon!A1:Z",
    "discounts!A2:Z",
  ];

  const response = await sheets.spreadsheets.values.batchGet({
    spreadsheetId: process.env.SHEET_ID_BETA!,
    ranges,
  });

  // Map the data into an object for better structure
  const result: Record<string, any[][]> = {};
  response.data.valueRanges?.forEach((valueRange, index) => {
    const sheetName = ranges[index].split("!")[0]; // Extract sheet name from range
    result[sheetName] = valueRange.values || []; // Store values or an empty array if no data
  });

  return result;
}
