import { NextResponse } from "next/server";
import { getKnowledgeSummary, listKnowledge } from "@/lib/memory/service";

export async function GET() {
  const [summary, knowledge] = await Promise.all([getKnowledgeSummary(), listKnowledge()]);
  return NextResponse.json({ summary, data: knowledge });
}

