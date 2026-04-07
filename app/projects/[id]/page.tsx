export default async function ProjectDetailPage(props: PageProps<'/projects/[id]'>) {
  const { id } = await props.params;
  return (
    <section>
      <h2 className="text-2xl font-semibold">Project {id}</h2>
      <p className="mt-2 text-sm text-slate-600">Project detail foundation is planned in the next deliverable.</p>
    </section>
  );
}
