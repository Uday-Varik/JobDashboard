import { NextRequest, NextResponse } from "next/server";
import { getFollowUpSuggestion } from "@/lib/claude/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const suggestion = await getFollowUpSuggestion(body);
    return NextResponse.json({ suggestion });
  } catch (error) {
    console.error("Follow-up AI error:", error);
    return NextResponse.json({ error: "Failed to get suggestion" }, { status: 500 });
  }
}
