// app/page.tsx
import { google } from "googleapis";

async function getGoogleSheetData() {
  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  const range = `Sheet1`;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID!,
    range,
  });

  return response.data.values || [];
}

export default async function Home() {
  const data = await getGoogleSheetData();
  console.log(data);

  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
}
