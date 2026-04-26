import { NextResponse } from "next/server";
import { createInvestor } from "@/lib/queries/investors";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      fund_name?: string;
      contact_name?: string;
      contact_role?: string;
      relationship_status?: string;
      sector_tags?: string[];
      stage_tags?: string[];
      geo_tags?: string[];
      preferred_angle?: string;
      next_action?: string;
      ai_summary?: string;
    };

    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 },
      );
    }

    const investor = await createInvestor({
      name: body.name,
      fund_name: body.fund_name?.trim() || undefined,
      contact_name: body.contact_name?.trim() || undefined,
      contact_role: body.contact_role?.trim() || undefined,
      relationship_status: body.relationship_status?.trim() || undefined,
      sector_tags: sanitizeTags(body.sector_tags),
      stage_tags: sanitizeTags(body.stage_tags),
      geo_tags: sanitizeTags(body.geo_tags),
      preferred_angle: body.preferred_angle?.trim() || undefined,
      next_action: body.next_action?.trim() || undefined,
      ai_summary: body.ai_summary?.trim() || undefined,
    });

    return NextResponse.json(investor, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function sanitizeTags(tags?: string[]) {
  const cleaned = tags?.map((tag) => tag.trim()).filter(Boolean);
  return cleaned?.length ? cleaned : undefined;
}
