import { FeatureSection } from './FeatureSection';
const features = [
  { icon: '🤖', title: 'AI Wiki Copilot', description: 'Ask questions about your knowledge base. Get instant answers with source citations.' },
  { icon: '🌳', title: 'Hierarchical Navigation', description: 'Organize pages in a tree structure. Navigate complex knowledge with ease.' },
  { icon: '📜', title: 'Revision History', description: 'Every change is tracked. Compare versions, restore previous content anytime.' },
  { icon: '🔍', title: 'Smart Search', description: 'Full-text search across all pages. Find exactly what you need in seconds.' },
];
export function FeatureGrid() {
  return (
    <section className="bg-[var(--bg)] py-16 px-6">
      <h2 className="text-3xl font-bold text-[var(--text)] text-center mb-10">Knowledge that works for your team</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {features.map(f => <FeatureSection key={f.title} {...f} />)}
      </div>
    </section>
  );
}
