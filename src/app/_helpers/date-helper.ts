export function getAllDayOfWeek(ym: string, dayOfWeek: number) {
  const date = new Date(`${ym}-01`);
  const diff = dayOfWeek - date.getDay();
  date.setDate(date.getDate() + diff + (diff < 0 ? 7 : 0));

  const dates = [];

  while (true) {
    const dateString = date.toJSON().substring(0, 10);
    if (!dateString.startsWith(ym)) {
      return dates;
    }
    dates.push(dateString);
    date.setDate(date.getDate() + 7);
  }
}
