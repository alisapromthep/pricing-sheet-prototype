import { getWhiteListedEmails } from "@/lib/googleSheets";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const authObject = auth();
  console.log("authObject", authObject);
  // const email = sessionClaims?.email;
  // console.log("email", email);
  const whitelist = await getWhiteListedEmails();
  console.log("whitelist", whitelist);

  //const isAllowed = whitelist.includes(email);

  // if (!isAllowed) {
  //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  // }

  return NextResponse.json({ ok: true });
}
