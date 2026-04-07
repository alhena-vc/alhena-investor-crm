import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getInvestorById } from '@/lib/queries/investors';
import { InvestorDetailView } from '@/components/investors/investor-detail-view';

export const dynamic = 'force-dynamic';

export default async function InvestorDetailPage(props: PageProps<'/investors/[id]'>) {
  const { id } = await props.params;
  const investor = await getInvestorById(id);

  if (!investor) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <Link href="/investors" className="inline-block text-sm text-slate-600 hover:text-slate-900">
        ← Back to investors
      </Link>
      <InvestorDetailView investor={investor} />
    </div>
  );
}
