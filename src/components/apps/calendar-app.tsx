"use client";

export function CalendarApp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();

  const monthName = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <div className="flex h-full flex-col bg-[#1e1e1e] p-6">
      <h2 className="mb-4 text-center text-lg font-semibold text-white">{monthName}</h2>

      <div className="grid grid-cols-7 gap-1 text-center">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="py-1 text-[11px] font-medium text-white/30">
            {d}
          </div>
        ))}

        {blanks.map((i) => (
          <div key={`blank-${i}`} />
        ))}

        {days.map((day) => (
          <div
            key={day}
            className={`flex h-8 w-8 items-center justify-center rounded-full text-[13px] mx-auto ${
              day === today
                ? "bg-blue-600 font-bold text-white"
                : "text-white/60"
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}
