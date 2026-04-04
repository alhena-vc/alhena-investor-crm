"use client";

import { useState } from "react";

type Investor = {
  name: string;
  type: string;
  status: string;
  check: string;
  focus: string;
  priority: string;
};

export default function Home() {
  const [investors, setInvestors] = useState<Investor[]>([
    {
      name: "Stravinsky Capital",
      type: "Фонд",
      status: "В диалоге",
      check: "50–100 млн ₽",
      focus: "EdTech",
      priority: "Высокий",
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState<Investor>({
    name: "",
    type: "",
    status: "",
    check: "",
    focus: "",
    priority: "",
  });

  const handleAdd = () => {
    setInvestors([...investors, form]);
    setForm({
      name: "",
      type: "",
      status: "",
      check: "",
      focus: "",
      priority: "",
    });
    setShowForm(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">CRM инвесторов</h1>

      <button
        onClick={() => setShowForm(true)}
        className="mb-4 px-4 py-2 bg-black text-white rounded"
      >
        + Добавить инвестора
      </button>

      {showForm && (
        <div className="mb-6 border p-4 rounded">
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(form).map((key) => (
              <input
                key={key}
                placeholder={key}
                value={(form as any)[key]}
                onChange={(e) =>
                  setForm({ ...form, [key]: e.target.value })
                }
                className="border p-2 rounded"
              />
            ))}
          </div>

          <button
            onClick={handleAdd}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
          >
            Сохранить
          </button>
        </div>
      )}

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>Название</th>
            <th>Тип</th>
            <th>Статус</th>
            <th>Чек</th>
            <th>Фокус</th>
            <th>Приоритет</th>
          </tr>
        </thead>
        <tbody>
          {investors.map((inv, i) => (
            <tr key={i} className="border-t">
              <td>{inv.name}</td>
              <td>{inv.type}</td>
              <td>{inv.status}</td>
              <td>{inv.check}</td>
              <td>{inv.focus}</td>
              <td>{inv.priority}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}