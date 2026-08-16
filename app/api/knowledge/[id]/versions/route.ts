import { NextResponse } from "next/server";
import { getKnowledgeVersions } from "@/lib/memory/service";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return NextResponse.json({ data: await getKnowledgeVersions(id) });
}

