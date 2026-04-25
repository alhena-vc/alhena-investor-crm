import 'server-only';

type FitInput = {
  investorName: string;
  projectName: string;
  investorFocus?: string | null;
  projectThesis?: string | null;
};

type OutreachInput = {
  investorName: string;
  contactPerson?: string | null;
  projectName: string;
  suggestedAngle?: string | null;
};

type InvestorSummaryInput = {
  investorName: string;
  sectors?: string | null;
  stages?: string | null;
  geography?: string | null;
  notes?: string | null;
};

async function maybeOpenAI(prompt: string): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
      temperature: 0.3,
      messages: [
        { role: 'system', content: 'You are a concise VC CRM assistant.' },
        { role: 'user', content: prompt },
      ],
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed: ${response.status}`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  return payload.choices?.[0]?.message?.content?.trim() ?? null;
}

export async function generateFitSummary(input: FitInput) {
  const fallback = [
    `Fit summary for ${input.investorName} ↔ ${input.projectName}:`,
    `- Focus overlap: ${input.investorFocus ?? 'No explicit focus recorded'}.`,
    `- Thesis alignment: ${input.projectThesis ?? 'Project thesis not provided'}.`,
    '- Suggested next step: run a short intro call and validate mandate/check size.',
  ].join('\n');

  const prompt = `Write a short investor-project fit summary with bullet points.\nInvestor: ${input.investorName}\nInvestor focus: ${input.investorFocus ?? 'n/a'}\nProject: ${input.projectName}\nProject thesis: ${input.projectThesis ?? 'n/a'}`;

  return (await maybeOpenAI(prompt)) ?? fallback;
}

export async function generateOutreachMessage(input: OutreachInput) {
  const contact = input.contactPerson || input.investorName;
  const fallback = `Hi ${contact},\n\nSharing ${input.projectName} because it aligns with your focus. ${input.suggestedAngle ?? 'I believe there is a strong strategic fit and would value your feedback.'}\n\nIf useful, I can send a short deck and key metrics.\n\nBest,\nALHENA VC`;

  const prompt = `Draft a concise outreach message to an investor.\nInvestor name: ${input.investorName}\nContact person: ${contact}\nProject: ${input.projectName}\nAngle: ${input.suggestedAngle ?? 'n/a'}`;

  return (await maybeOpenAI(prompt)) ?? fallback;
}

export async function generateInvestorSummary(input: InvestorSummaryInput) {
  const fallback = [
    `${input.investorName} investor profile:`,
    `- Sectors: ${input.sectors ?? 'not specified'}`,
    `- Stages: ${input.stages ?? 'not specified'}`,
    `- Geography: ${input.geography ?? 'not specified'}`,
    `- Notes: ${input.notes ?? 'none'}`,
  ].join('\n');

  const prompt = `Summarize this investor in 4 bullets for CRM use.\nName: ${input.investorName}\nSectors: ${input.sectors ?? 'n/a'}\nStages: ${input.stages ?? 'n/a'}\nGeography: ${input.geography ?? 'n/a'}\nNotes: ${input.notes ?? 'n/a'}`;

  return (await maybeOpenAI(prompt)) ?? fallback;
}
