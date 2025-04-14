import { getWhiteListedEmails } from "@/lib/googleSheets";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId, sessionClaims } = auth();
  const email = sessionClaims?.email;

  if (!email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const whitelist = await getWhiteListedEmails();
  const isAllowed = whitelist.includes(email);

  if (!isAllowed) {
    return new Response("Forbidden", { status: 403 });
  }

  return Response.json({ allowed: true });
}
