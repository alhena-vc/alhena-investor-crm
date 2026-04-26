import { NextResponse } from "next/server";
import { createProject } from "@/lib/projects";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      sector?: string;
      stage?: string;
      geography?: string;
      raise_target_usd?: number;
      summary?: string;
    };

    if (!body.name?.trim()) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 });
    }

    if (!body.sector?.trim() || !body.stage?.trim() || !body.geography?.trim()) {
      return NextResponse.json(
        { error: "sector, stage and geography are required" },
        { status: 400 },
      );
    }

    if (!body.summary?.trim()) {
      return NextResponse.json({ error: "Summary is required" }, { status: 400 });
    }

    const project = await createProject({
      name: body.name,
      sector: body.sector,
      stage: body.stage,
      geography: body.geography,
      raise_target_usd: body.raise_target_usd,
      summary: body.summary,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
