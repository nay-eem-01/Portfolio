// Month maths for the experience timeline, LinkedIn style: both months count ("Oct to Dec" is 3 months).
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const parse = (ym: string) => { const [y, m] = ym.split('-').map(Number); return { y, m }; };
const nowYm = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; };

export const monthLabel = (ym: string) => { const { y, m } = parse(ym); return `${MONTHS[m - 1]} ${y}`; };

export function months(start: string, end?: string) {
  const a = parse(start), b = parse(end || nowYm());
  return Math.max(1, (b.y - a.y) * 12 + (b.m - a.m) + 1);
}

export function duration(n: number) {
  const y = Math.floor(n / 12), m = n % 12;
  const parts = [y ? `${y} yr${y > 1 ? 's' : ''}` : '', m ? `${m} mo${m > 1 ? 's' : ''}` : ''].filter(Boolean);
  return parts.join(' ');
}
