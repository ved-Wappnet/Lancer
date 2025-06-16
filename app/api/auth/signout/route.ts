import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST(req: NextRequest) {
  // Remove the token cookie by setting it expired
  const response = NextResponse.json({ message: "Signed out" });
  response.headers.set(
    "Set-Cookie",
    serialize("token", "", {
      httpOnly: true,
      path: "/",
      expires: new Date(0),
      sameSite: "lax"
    })
  );
  return response;
}
