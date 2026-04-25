import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

const nav = [
  { href: '/', label: 'Dashboard' },
  { href: '/investors', label: 'Investors' },
  { href: '/projects', label: 'Projects' },
  { href: '/matches', label: 'Matches' },
  { href: '/activities', label: 'Activities' },
];

export const metadata: Metadata = {
  title: 'ALHENA VC Investor CRM',
  description: 'MVP CRM for investors, projects, and matching workflow.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 md:grid-cols-[220px_1fr]">
          <aside className="border-r border-slate-200 bg-white p-4">
            <h1 className="mb-4 text-lg font-semibold">ALHENA VC CRM</h1>
            <nav className="space-y-1">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} className="block rounded-md px-3 py-2 text-sm hover:bg-slate-100">
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
          <main className="p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
