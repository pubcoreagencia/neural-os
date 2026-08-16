import { NextResponse } from "next/server";
import { getKnowledgeById } from "@/lib/memory/service";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const data = await getKnowledgeById(id);
  if (!data) {
    return NextResponse.json({ error: "Knowledge not found" }, { status: 404 });
  }
  return NextResponse.json({ data });
}

