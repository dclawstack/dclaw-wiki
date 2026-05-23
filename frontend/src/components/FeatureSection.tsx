export function FeatureSection({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border-col)] rounded-xl p-6">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-[var(--text)] mb-2">{title}</h3>
      <p className="text-[var(--text-muted)] text-sm">{description}</p>
    </div>
  );
}
