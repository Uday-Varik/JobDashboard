import { NextRequest, NextResponse } from "next/server";
import { getApplicationInsights } from "@/lib/claude/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const insights = await getApplicationInsights(body);
    return NextResponse.json({ insights });
  } catch (error) {
    console.error("Insights AI error:", error);
    return NextResponse.json({ error: "Failed to get insights" }, { status: 500 });
  }
}
