export function getLocalDateString(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function formatDateString(s: string) {
  const [yyyy, mm, dd] = s.split('-');
  return `${dd}.${mm}.${yyyy}`;
}

export function shiftDateString(s: string, days: number) {
  const [y, m, d] = s.split('-').map(Number);
  return getLocalDateString(new Date(y, m - 1, d + days));
}
