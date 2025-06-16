import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  // Ensure the users table exists before any queries
  await User.sync({ alter: true });
  try {
    const { name, email, password, role } = await req.json();
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    // Check if user exists
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }
    // Hash password
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });
    return NextResponse.json({ message: "User created", user: { id: user.id, name: user.name, email: user.email, role: user.role } }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Server error", details: err }, { status: 500 });
  }
}
