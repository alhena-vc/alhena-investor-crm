import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alhena CRM v2 (Clean)",
  description: "New clean-slate investor CRM project",
};

const items = [
  { href: "/investors", label: "Investors" },
  { href: "/projects", label: "Projects" },
  { href: "/deals", label: "Deals" },
  { href: "/communications", label: "Communications" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <h1>Alhena CRM v2 — New Project</h1>
          <p className="muted">Independent clean-slate app (port 3010).</p>
          <nav className="nav">
            {items.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}
