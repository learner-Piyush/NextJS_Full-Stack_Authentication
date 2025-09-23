import { connectDB } from "@/db/db";
import { User } from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { getTokenData } from "@/helpers/getTokenData";

connectDB();

export async function GET(request: NextRequest) {
  try {
    const userId = await getTokenData(request);
    const user = await User.findOne({ _id: userId }).select("-password");

    const response = NextResponse.json({
      message: "User found",
      data: user,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
