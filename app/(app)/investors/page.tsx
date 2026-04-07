import Link from "next/link";
import { AddInvestorModal } from "@/components/add-investor-modal";
import { listInvestors } from "@/lib/investors";

export const dynamic = "force-dynamic";

export default async function InvestorsPage() {
  let investors = [] as Awaited<ReturnType<typeof listInvestors>>;
  let error: string | null = null;

  try {
    investors = await listInvestors();
  } catch (fetchError) {
    error = fetchError instanceof Error ? fetchError.message : "Unknown error";
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Investors</h2>
          <p className="text-sm text-slate-600">Synced from Supabase.</p>
        </div>
        <AddInvestorModal />
      </div>

      {error ? (
        <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Supabase error: {error}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Firm</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Stage</th>
            </tr>
          </thead>
          <tbody>
            {investors.map((investor) => (
              <tr key={investor.id} className="border-t border-slate-100">
                <td className="px-4 py-3">
                  <Link
                    href={`/investors/${investor.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {investor.name}
                  </Link>
                </td>
                <td className="px-4 py-3">{investor.firm ?? "—"}</td>
                <td className="px-4 py-3">{investor.email ?? "—"}</td>
                <td className="px-4 py-3">{investor.stage ?? "—"}</td>
              </tr>
            ))}
            {investors.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={4}>
                  No investors yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
