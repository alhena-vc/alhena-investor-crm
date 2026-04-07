export type Investor = {
  id: string;
  name: string;
  email: string | null;
  firm: string | null;
  stage: string | null;
  notes: string | null;
  created_at: string | null;
};

export type NewInvestorInput = {
  name: string;
  email?: string;
  firm?: string;
  stage?: string;
  notes?: string;
};
