import { Button } from '@/components/ui/button'
import SectionGlow from '@/components/section-glow'

export default function CTABanner() {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden" id="cta">
      <SectionGlow />
      {/* Top divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-amber-800/20 to-transparent" />

      <div className="relative z-10 px-6 lg:px-12 max-w-4xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden p-12 lg:p-16 border border-stone-200 bg-white/80 backdrop-blur-xl shadow-lg shadow-stone-900/5">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-amber-700/[0.05] blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-blue-900/[0.04] blur-3xl pointer-events-none" />
          <div className="absolute -top-32 -right-32 w-72 h-72 rounded-full border border-amber-800/8 pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-72 h-72 rounded-full border border-amber-800/8 pointer-events-none" />

          <div className="relative z-10 text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-800/20 bg-amber-50 text-amber-900 text-xs font-bold tracking-widest mb-2">
              FREE TO USE
            </div>

            <h2 className="text-4xl lg:text-5xl font-display font-bold heading-gradient">
              Your Rights. Clarified.
            </h2>

            <p className="text-lg text-stone-500 font-serif max-w-2xl mx-auto leading-relaxed">
              Start your journey to legal clarity with GeoLegal. Get jurisdiction-specific answers to any legal question, powered by India's most comprehensive legal database.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button className="bg-gradient-to-r from-amber-700 to-blue-800 hover:from-amber-600 hover:to-blue-700 text-white font-bold px-8 py-6 h-auto text-base shadow-xl shadow-amber-900/15 hover:-translate-y-0.5 transition-all duration-200">
                Ask Your Question Now →
              </Button>
              <Button className="border border-amber-800/30 text-amber-900 hover:bg-amber-50 font-bold px-8 py-6 h-auto text-base bg-white transition-all duration-200">
                Browse IPC Sections
              </Button>
            </div>

            <div className="pt-8 border-t border-stone-100 flex flex-wrap justify-center gap-8">
              {[
                { icon: '🔒', label: 'Zero Data Stored' },
                { icon: '⚖️', label: 'Legally Accurate' },
                { icon: '🤖', label: 'AI-Powered' },
                { icon: '⚡', label: 'Instant Answers' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-lg">{icon}</span>
                  <p className="text-xs text-stone-400 uppercase tracking-wider font-bold">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
