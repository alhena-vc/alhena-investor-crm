import Link from 'next/link';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/investors', label: 'Investors' },
  { href: '/projects', label: 'Projects' },
  { href: '/outreach', label: 'Outreach' },
  { href: '/followups', label: 'Followups' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-7xl">
        <aside className="sticky top-0 h-screen w-64 border-r border-slate-200 bg-white p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">ALHENA VC</p>
          <h1 className="mt-2 text-lg font-semibold">Investor CRM</h1>
          <nav className="mt-8 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="min-h-screen flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
