import { NextResponse } from "next/server";
import { createInvestor } from "@/lib/investors";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      firm?: string;
      stage?: string;
      notes?: string;
    };

    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 },
      );
    }

    const investor = await createInvestor({
      name: body.name,
      email: body.email,
      firm: body.firm,
      stage: body.stage,
      notes: body.notes,
    });

    return NextResponse.json(investor, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
