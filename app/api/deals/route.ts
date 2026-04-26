import { NextResponse } from "next/server";
import { createDeal } from "@/lib/deals";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      investor_id?: string;
      project_id?: string;
      stage_id?: string;
      deal_type?: "equity" | "debt" | "venture_loan" | "other";
      amount_usd?: number;
      status_note?: string;
    };

    if (!body.investor_id || !body.project_id || !body.stage_id || !body.deal_type) {
      return NextResponse.json(
        { error: "investor_id, project_id, stage_id and deal_type are required" },
        { status: 400 },
      );
    }

    const deal = await createDeal({
      investor_id: body.investor_id,
      project_id: body.project_id,
      stage_id: body.stage_id,
      deal_type: body.deal_type,
      amount_usd: body.amount_usd,
      status_note: body.status_note,
    });

    return NextResponse.json(deal, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
