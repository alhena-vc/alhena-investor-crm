import { NextResponse } from "next/server";
import { createProject } from "@/lib/crm";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      sector?: string;
      stage?: string;
      geography?: string;
      summary?: string;
    };

    if (!body.name?.trim()) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const fields = ["sector", "stage", "geography", "summary"] as const;
    for (const field of fields) {
      if (!body[field]?.trim()) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    const created = await createProject({
      name: body.name,
      sector: body.sector!,
      stage: body.stage!,
      geography: body.geography!,
      summary: body.summary!,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
