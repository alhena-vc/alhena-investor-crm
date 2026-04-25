import { getInvestors } from '@/lib/queries/investors';
import { InvestorsView } from '@/components/investors/investors-view';

export const dynamic = 'force-dynamic';

export default async function InvestorsPage() {
  const investors = await getInvestors();
  return <InvestorsView investors={investors} />;
}
