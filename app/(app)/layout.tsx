import { SidebarNav } from "@/components/sidebar-nav";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-56 flex-shrink-0 bg-[#0d1117] border-r border-white/[0.06] flex flex-col">
        <div className="px-5 pt-6 pb-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Alhena</p>
          <p className="text-xl font-bold text-white mt-0.5">CRM</p>
        </div>
        <div className="flex-1 px-2 pb-4 overflow-y-auto">
          <SidebarNav />
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
