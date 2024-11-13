// app/page.tsx
import { google } from "googleapis";
import Form from "./components/Form/Form";

async function getGoogleSheetData() {
  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  const range = `frame!A3:Z`;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID!,
    range,
  });

  return response.data.values || [];
}

export default async function Home() {
  const data: string[][] = await getGoogleSheetData();
  console.log(data);
  return (
    <div className="">
      <h1>Home Page</h1>
      <Form data={data} />
    </div>
  );
}
