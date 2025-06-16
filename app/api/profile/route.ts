import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { parse } from "cookie";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  try {
    // Get cookie header
    const cookieHeader = req.headers.get("cookie");
    if (!cookieHeader) {
      return NextResponse.json({ error: "No auth token" }, { status: 401 });
    }
    // Parse cookies and get token
    const cookies = parse(cookieHeader);
    const token = cookies.token;
    if (!token) {
      return NextResponse.json({ error: "No auth token" }, { status: 401 });
    }
    // Decode and verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, "secret");
    } catch (err) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
    // decoded is type 'string | JwtPayload', so we cast to any for id access
    const user = await User.findOne({ where: { id: (decoded as any).id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // Return user profile (excluding password)
    const { id, name, email, role, image, createdAt, updatedAt } = user;
    return NextResponse.json({ id, name, email, role, image, createdAt, updatedAt });
  } catch (err) {
    return NextResponse.json({ error: "Server error", details: err }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie");
    if (!cookieHeader) {
      return NextResponse.json({ error: "No auth token" }, { status: 401 });
    }
    const cookies = parse(cookieHeader);
    const token = cookies.token;
    if (!token) {
      return NextResponse.json({ error: "No auth token" }, { status: 401 });
    }
    let decoded: any;
    try {
      decoded = jwt.verify(token, "secret");
    } catch (err) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
    const user = await User.findOne({ where: { id: (decoded as any).id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const { name, password, newPassword } = await req.json();
    // Update name if provided
    if (name) {
      user.name = name;
    }
    // Change password logic
    if (password && newPassword) {
      const isSame = await bcrypt.compare(newPassword, user.password);
      if (isSame) {
        return NextResponse.json({ error: "New password must be different from the current password." }, { status: 400 });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }
    await user.save();
    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Server error", details: err }, { status: 500 });
  }
}
