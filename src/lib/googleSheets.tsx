import { google } from "googleapis";
import path from "path";

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(process.cwd(), "secrets.json"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

export const getWhiteListedEmails = async (): Promise<string[]> => {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = process.env.WHITELIST_EMAIL_SHEET_ID;
  const range = "users!A2:A";

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const values = res.data.values ?? [];
  return values.flat();
};
