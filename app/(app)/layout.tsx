import { SidebarNav } from "@/components/sidebar-nav";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[240px_1fr]">
      <aside className="border-r border-slate-200 bg-white p-4">
        <h1 className="mb-6 text-lg font-semibold">Alhena CRM</h1>
        <SidebarNav />
      </aside>
      <main className="p-6">{children}</main>
    </div>
  );
}
