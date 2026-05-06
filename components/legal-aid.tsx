import { Phone, ShieldCheck, Users, HandHeart, Baby, Accessibility } from 'lucide-react'
import { Button } from '@/components/ui/button'

const legalAidServices = [
  {
    org: 'NALSA',
    fullName: 'National Legal Services Authority',
    helpline: '15100',
    description: 'Free legal aid for economically weaker sections across all states and union territories.',
  },
  {
    org: 'DLSA',
    fullName: 'District Legal Services Authority',
    helpline: 'Varies by district',
    description: 'Free legal aid, mediation, and ADR services at the district level.',
  },
  {
    org: 'Bar Council',
    fullName: 'State Bar Councils',
    helpline: 'Varies by state',
    description: 'Advocate referral services and disciplinary complaints against lawyers.',
  },
]

const qualifies = [
  { icon: ShieldCheck, label: 'Persons below the poverty line' },
  { icon: Users, label: 'Scheduled Castes and Scheduled Tribes' },
  { icon: Accessibility, label: 'Persons with disabilities' },
  { icon: HandHeart, label: 'Victims of human trafficking' },
  { icon: Baby, label: 'Women and children in distress' },
]

const rights = [
  'Right to remain silent during police interrogation',
  'Right to inform a family member of your arrest',
  'Right to consult an advocate of your choice',
  'Right to bail in most bailable offences',
]

export default function LegalAid() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden" id="legal-aid">
      <div className="absolute inset-0 bg-amber-50/40" />
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-amber-700/[0.05] blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-blue-900/[0.04] blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] rounded-full bg-amber-600/[0.03] blur-[80px] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(90,50,10,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(90,50,10,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 space-y-3">
          <p className="text-xs font-black text-amber-800 uppercase tracking-[0.25em]">Free Legal Help</p>
          <h2 className="text-4xl lg:text-5xl font-display font-bold heading-gradient">
            Legal Aid Is Your Right
          </h2>
          <p className="text-stone-500 font-serif max-w-2xl mx-auto text-lg leading-relaxed">
            Under Article 39A of the Constitution and Section 304 CrPC, every Indian citizen is entitled to free legal aid.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            {/* Who qualifies */}
            <div className="flex-1 rounded-2xl border border-stone-200 bg-white/80 p-8 space-y-6 shadow-sm">
              <h3 className="text-xs font-black text-amber-800 uppercase tracking-widest border-b border-stone-100 pb-3">
                Who Qualifies?
              </h3>
              <ul className="space-y-4">
                {qualifies.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-800/15 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-amber-800" strokeWidth={1.5} />
                    </div>
                    <span className="text-stone-600 font-serif text-sm">{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white/80 p-8 space-y-5 shadow-sm">
              <h3 className="text-xs font-black text-amber-800 uppercase tracking-widest border-b border-stone-100 pb-3">
                Know Your Rights
              </h3>
              <ul className="space-y-3">
                {rights.map((right) => (
                  <li key={right} className="flex gap-3 text-sm text-stone-500 font-serif">
                    <span className="text-amber-800 font-black mt-0.5 shrink-0">→</span>
                    {right}
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-gradient-to-r from-amber-700 to-blue-800 hover:from-amber-600 hover:to-blue-700 text-white font-bold py-5 h-auto text-sm shadow-md shadow-amber-900/15 transition-all duration-200 mt-2">
                Find Your Nearest Legal Aid Office →
              </Button>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {legalAidServices.map((service) => (
              <div
                key={service.org}
                className="rounded-2xl border border-stone-200 bg-white/80 p-7 space-y-4 hover:border-amber-800/20 hover:shadow-md transition-all duration-200 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-50 border border-amber-800/20 text-amber-900 text-xs font-black tracking-wider">
                    {service.org}
                  </span>
                  <span className="text-stone-400 text-xs font-serif">{service.fullName}</span>
                </div>
                <p className="text-sm text-stone-500 font-serif leading-relaxed">
                  {service.description}
                </p>
                <div className="pt-3 border-t border-stone-100 flex items-center gap-3 text-amber-900 font-bold text-sm">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5 text-amber-800" strokeWidth={2} />
                  </div>
                  {service.helpline}
                </div>
              </div>
            ))}

            {/* Constitutional callout */}
            <div className="flex-1 rounded-2xl border border-amber-800/15 bg-gradient-to-br from-amber-50 to-blue-50/30 p-8 flex flex-col justify-center gap-4 shadow-sm">
              <p className="text-xs font-black text-amber-800 uppercase tracking-[0.2em]">Constitutional Guarantee</p>
              <p className="text-stone-600 font-serif text-sm leading-relaxed">
                <span className="text-amber-900 font-bold">Article 39A</span> directs the State to ensure equal justice and free legal aid to citizens who cannot afford counsel due to economic or other disabilities.
              </p>
              <p className="text-stone-600 font-serif text-sm leading-relaxed">
                <span className="text-amber-900 font-bold">Section 304 CrPC</span> mandates the court to assign a pleader at State expense if the accused has no means to engage one.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
