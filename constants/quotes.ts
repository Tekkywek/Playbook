/** Rotates by calendar day for a stable “daily” quote */
export const MOTIVATIONAL_QUOTES: string[] = [
  'Champions keep playing until they get it right.',
  'You miss 100% of the shots you don’t take.',
  'Hard work beats talent when talent doesn’t work hard.',
  'The more you sweat in practice, the less you bleed in battle.',
  'Discipline is doing what needs to be done, even when you don’t feel like it.',
  'Excellence is not a singular act — it’s a habit.',
  'Leave it all on the field. No regrets.',
  'Pain is temporary. Pride is forever.',
  'One team. One heartbeat.',
  'Play with passion or not at all.',
];

export function quoteForToday(): string {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = Date.now() - start.getTime();
  const day = Math.floor(diff / (1000 * 60 * 60 * 24));
  return MOTIVATIONAL_QUOTES[day % MOTIVATIONAL_QUOTES.length];
}

export function greetingForNow(name: string): string {
  const h = new Date().getHours();
  const part = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  return `${part}, ${name} ⚡`;
}
