import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alhena Investor CRM",
  description: "Minimal investor CRM shell",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
