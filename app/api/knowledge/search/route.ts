import { NextResponse } from "next/server";
import { searchKnowledge } from "@/lib/memory/service";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    query?: string;
    domain?: string;
    entityId?: string;
  };

  if (!body?.query) {
    return NextResponse.json({ error: "query is required" }, { status: 400 });
  }

  const data = await searchKnowledge(body.query, { domain: body.domain, entityId: body.entityId });
  return NextResponse.json({ data });
}

