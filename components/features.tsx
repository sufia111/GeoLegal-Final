import { Scale, BookOpen, Shield, Layers, Bell, MapPin } from 'lucide-react'
import SectionGlow from '@/components/section-glow'

const features = [
  {
    size: 'large',
    title: 'AI Legal Advisor',
    description: 'Ask any legal question in plain language. Get structured answers citing exact IPC sections, state amendments, constitutional rights, and recommended action steps.',
    Icon: Scale,
    badge: 'Core Feature',
  },
  {
    size: 'large',
    title: 'IPC Section Browser',
    description: 'Browse all 500+ IPC sections organized by category. Each entry shows the offense, punishment, cognizability, bailability, and state-specific variations for your selected jurisdiction.',
    Icon: BookOpen,
    badge: null,
  },
  {
    size: 'small',
    title: 'Know Your Rights',
    description: 'Plain-language guide to Articles 19-22, bail rights, FIR filing, right to legal aid, and police powers in your state.',
    Icon: Shield,
  },
  {
    size: 'small',
    title: 'State Law Overlays',
    description: 'State-specific amendments, local acts like MCOCA, UP Gangsters Act, and Tamil Nadu Goondas Act — surfaced automatically.',
    Icon: Layers,
  },
  {
    size: 'small',
    title: 'Live Legal Updates',
    description: 'Latest Supreme Court judgments, High Court orders, and new state legislation — filtered to your jurisdiction.',
    Icon: Bell,
  },
  {
    size: 'small',
    title: 'Legal Aid Locator',
    description: 'DLSA contacts, NALSA services, Bar Council details, and state-specific free legal aid helplines.',
    Icon: MapPin,
  },
]

export default function Features() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden" id="features">
      {/* Section glow */}
      <div className="absolute inset-0 pointer-events-none">
        <SectionGlow />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-amber-800/20 to-transparent" />
      </div>

      <div className="relative z-10 px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 space-y-4">
          <p className="text-amber-800 font-bold text-xs uppercase tracking-widest">Built for Real Legal Needs</p>
          <h2 className="text-4xl lg:text-5xl font-display font-bold heading-gradient">
            Everything you need to understand Indian law
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 auto-rows-max">
          {features.map((feature, idx) => {
            const Icon = feature.Icon
            const isLarge = feature.size === 'large'
            const gridClass = isLarge ? 'lg:col-span-2 lg:row-span-2' : 'lg:col-span-2'

            return (
              <div
                key={idx}
                className={`${gridClass} group relative p-8 rounded-2xl border border-stone-200 bg-white/70 backdrop-blur-sm hover:border-amber-800/20 hover:bg-white/90 transition-all duration-300 hover:-translate-y-1 overflow-hidden shadow-sm hover:shadow-md`}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-700/[0.03] to-blue-900/[0.03]" />
                </div>
                <div className="absolute left-0 top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-amber-800/30 to-transparent" />

                <div className="space-y-4 h-full flex flex-col relative">
                  <div className="flex items-start justify-between">
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-800/15">
                      <Icon className="w-6 h-6 text-amber-800" strokeWidth={1.5} />
                    </div>
                    {feature.badge && (
                      <span className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-800/20 px-3 py-1 rounded-full">
                        {feature.badge}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 flex-1">
                    <h3 className="text-xl font-display font-bold text-stone-800 transition-colors duration-200">
                      {feature.title}
                    </h3>
                    <p className="text-stone-500 font-serif text-sm lg:text-base leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <div className="text-amber-800/50 text-sm font-bold group-hover:text-amber-800 group-hover:translate-x-1 transition-all duration-200">
                    Learn more →
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
