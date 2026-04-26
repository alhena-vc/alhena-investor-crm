import { NextResponse } from "next/server";
import { createInvestor } from "@/lib/crm";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      investor_type?: string;
      stage_focus?: string;
      sector_focus?: string;
      geography_focus?: string;
    };

    if (!body.name?.trim()) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const fields = ["investor_type", "stage_focus", "sector_focus", "geography_focus"] as const;
    for (const field of fields) {
      if (!body[field]?.trim()) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    const created = await createInvestor({
      name: body.name,
      investor_type: body.investor_type!,
      stage_focus: body.stage_focus!,
      sector_focus: body.sector_focus!,
      geography_focus: body.geography_focus!,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
