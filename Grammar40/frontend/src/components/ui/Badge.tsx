const colors: Record<string, string> = {
  'Week Warrior': 'badge-gold',
  'Century Club': 'badge-blue',
  'Perfect Day': 'badge-green',
};
const icons: Record<string, string> = {
  'Week Warrior': '🔥',
  'Century Club': '💯',
  'Perfect Day': '⭐',
};

export default function Badge({ name }: { name: string }) {
  return (
    <span className={`${colors[name] || 'badge-green'} animate-fade-in`}>
      {icons[name] || '🏅'} {name}
    </span>
  );
}
