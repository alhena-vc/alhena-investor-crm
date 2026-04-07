import { NextResponse } from 'next/server';
import { createInvestor } from '@/lib/queries/investors';
import type { CreateInvestorPayload } from '@/types/investor';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateInvestorPayload;

    if (!body?.name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const payload: CreateInvestorPayload = {
      ...body,
      name: body.name.trim(),
    };

    const investor = await createInvestor(payload);
    return NextResponse.json(investor, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
