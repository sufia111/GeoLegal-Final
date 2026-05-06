import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SectionGlow from '@/components/section-glow'

const updates = [
  {
    date: 'Recent',
    jurisdiction: 'Supreme Court',
    tag_color: 'crimson',
    title: 'SC Reaffirms Bail Rights Under Section 436A CrPC',
    excerpt: 'Persons who have served half their maximum sentence are entitled to bail as a matter of right, court reiterates...',
  },
  {
    date: 'Recent',
    jurisdiction: 'Maharashtra',
    tag_color: 'gold',
    title: 'Maharashtra Amends State Police Act — Search & Seizure Powers Updated',
    excerpt: 'New provisions expand police authority for preventive detention in organized crime matters...',
  },
  {
    date: 'Recent',
    jurisdiction: 'Delhi (NCT)',
    tag_color: 'gold',
    title: 'Delhi HC on FIR Registration: Police Cannot Delay Beyond 24 Hours',
    excerpt: 'High Court reaffirms mandatory duty to register FIR upon receipt of cognizable offense information...',
  },
]

export default function RecentUpdates() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden" id="recent-updates">
      <SectionGlow />
      <div className="relative z-10 px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <p className="text-amber-800 font-bold text-sm uppercase tracking-widest mb-4">Live Legal Intelligence</p>
          <h2 className="text-4xl lg:text-5xl font-display font-bold heading-gradient mb-6">
            Latest from India's Courts & Legislatures
          </h2>
          <p className="text-lg text-stone-500 font-serif">
            GeoLegal pulls real-time updates on Supreme Court judgments, High Court orders, and new state legislation — so your guidance is never outdated.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {updates.map((update, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-white/80 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 hover:-translate-y-2 border border-stone-200"
              style={{
                borderLeftColor: update.tag_color === 'gold' ? '#92400e' : '#7f1d1d'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">{update.date}</span>
                <span
                  className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: update.tag_color === 'gold' ? 'rgba(120,53,15,0.08)' : 'rgba(127,29,29,0.08)',
                    color: update.tag_color === 'gold' ? '#92400e' : '#991b1b'
                  }}
                >
                  {update.jurisdiction}
                </span>
              </div>

              <h3 className="text-lg font-display font-bold text-stone-800 mb-3">
                {update.title}
              </h3>

              <p className="text-sm text-stone-500 font-serif leading-relaxed">
                {update.excerpt}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button className="bg-transparent border-2 border-amber-800 text-amber-900 hover:bg-amber-800 hover:text-white font-bold px-8 py-6 h-auto text-base transition-all duration-200">
            View All Updates →
          </Button>
        </div>
      </div>
    </section>
  )
}
