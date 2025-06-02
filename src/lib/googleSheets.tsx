import { google } from "googleapis";

export const getWhiteListedEmails = async (): Promise<string[]> => {
  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  const spreadsheetId = process.env.WHITELIST_EMAIL_SHEET_ID;
  const range = "users!A2:A";

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const values = response.data.values ?? [];
  console.log("values in googleSheet", values);
  return values.flat();
};
