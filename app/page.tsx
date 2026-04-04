export default function HomePage() {
  const investors = [
    {
      name: "Stravinsky Capital",
      type: "Фонд",
      stage: "В диалоге",
      check: "50–100 млн ₽",
      focus: "EdTech, growth",
      priority: "Высокий",
    },
    {
      name: "Московский венчурный фонд",
      type: "Институт развития",
      stage: "Партнёрство / долг",
      check: "до 50 млн ₽",
      focus: "Льготные займы",
      priority: "Высокий",
    },
    {
      name: "Частный инвестор A",
      type: "Частный капитал",
      stage: "Первичный контакт",
      check: "10–30 млн ₽",
      focus: "B2B SaaS",
      priority: "Средний",
    },
    {
      name: "Family Office Gulf",
      type: "Family office",
      stage: "Нужно познакомить",
      check: "$250k–1m",
      focus: "International / AI",
      priority: "Средний",
    },
    {
      name: "Strategic Corp",
      type: "Стратег",
      stage: "Переговоры",
      check: "по ситуации",
      focus: "M&A / синергия",
      priority: "Высокий",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">ALHENA VC</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              CRM для инвесторов
            </h1>
            <p className="mt-3 max-w-3xl text-sm text-slate-600">
              MVP-прототип для ведения инвесторов, статусов коммуникации,
              фокусов по сделкам и приоритетов по следующим шагам.
            </p>
          </div>

          <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-700">
            + Добавить инвестора
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="text-sm text-slate-500">Всего инвесторов</div>
            <div className="mt-2 text-2xl font-semibold">5</div>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="text-sm text-slate-500">Активные диалоги</div>
            <div className="mt-2 text-2xl font-semibold">3</div>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="text-sm text-slate-500">Высокий приоритет</div>
            <div className="mt-2 text-2xl font-semibold">3</div>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="text-sm text-slate-500">Следующие шаги</div>
            <div className="mt-2 text-2xl font-semibold">4</div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-base font-semibold">Инвесторы</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Название</th>
                  <th className="px-5 py-3 font-medium">Тип</th>
                  <th className="px-5 py-3 font-medium">Статус</th>
                  <th className="px-5 py-3 font-medium">Чек</th>
                  <th className="px-5 py-3 font-medium">Фокус</th>
                  <th className="px-5 py-3 font-medium">Приоритет</th>
                </tr>
              </thead>
              <tbody>
                {investors.map((investor) => (
                  <tr key={investor.name} className="border-t border-slate-100">
                    <td className="px-5 py-4 font-medium">
                      {investor.name}
                    </td>
                    <td className="px-5 py-4 text-slate-600">{investor.type}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">
                        {investor.stage}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{investor.check}</td>
                    <td className="px-5 py-4 text-slate-600">{investor.focus}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
                        {investor.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}