import InvestorsWorkspace from '@/components/investors-workspace'
import { getInvestors } from '@/lib/queries/investors'
import type { Investor } from '@/types/investor'

export const dynamic = 'force-dynamic'

export default async function InvestorsPage() {
  let investors: Investor[] = []

  try {
    investors = await getInvestors()
  } catch {
    // workspace handles empty state
  }

  return (
    <div className="h-full">
      <InvestorsWorkspace investors={investors} />
    </div>
  )
}
