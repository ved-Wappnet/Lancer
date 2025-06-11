import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { parse } from "cookie";

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
    const { id } = decoded as any;
    const { image } = await req.json();
    if (typeof image === "undefined") {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    user.image = image;
    await user.save();
    return NextResponse.json({ message: "Profile image updated", image });
  } catch (err) {
    return NextResponse.json({ error: "Server error", details: err }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
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
    const { id } = decoded as any;
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    user.image = null;
    await user.save();
    return NextResponse.json({ message: "Profile image removed" });
  } catch (err) {
    return NextResponse.json({ error: "Server error", details: err }, { status: 500 });
  }
}
