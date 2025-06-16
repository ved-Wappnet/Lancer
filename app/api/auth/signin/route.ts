import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      "secret",
      { expiresIn: "7d" }
    );
    // Set token as HTTP-only cookie
    const response = NextResponse.json({ 
      message: "Signed in", 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        image: user.image || null
      } 
    });
    response.headers.set(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: "lax"
      })
    );
    return response;
  } catch (err) {
    return NextResponse.json({ error: "Server error", details: err }, { status: 500 });
  }
}
