import { NextResponse } from "next/server";
import { ingestKnowledgeFromFile } from "@/lib/memory/service";
import type { KnowledgeDomain } from "@/lib/memory/entities";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    filePath: string;
    title: string;
    sourceUri: string;
    sourceType: "markdown" | "pdf" | "text";
    version?: string;
    author?: string;
    owner?: string;
    domain?: string;
    category?: string;
    entityType?: KnowledgeDomain | string;
    entityId?: string;
    tags?: string[];
    permissions?: string[];
  };

  if (!body?.filePath || !body?.title || !body?.sourceUri || !body?.sourceType) {
    return NextResponse.json({ error: "filePath, title, sourceUri and sourceType are required" }, { status: 400 });
  }

  const result = await ingestKnowledgeFromFile({
    ...body,
    version: body.version ?? "1.0.0"
  });

  return NextResponse.json({ data: result }, { status: 201 });
}
